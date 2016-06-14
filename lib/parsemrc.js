'use strict'
const H = require('highland')
const fs = require('fs')
const marc = require('marcjs')
const util = require('util')
// const xml2js = require('xml2js')

// const builder = new xml2js.Builder({headless: true})
const inspect = require('eyes').inspector({maxLength: false})
inspect(null)
module.exports = {
  // the lookup for barcodes to customer codes
  barcodes: new Map(),

  // this is the basic repeatable format for each SCSB middleware export record
  recordLayout: {
    bibRecord: {
      bib: {
        owningInstitutionId: ['NYPL']
      },
      holdings: {
        holding: []
      }
    }
  },

  /**
   * Sets up a logger

   * @param  {string} barcodeFile - the file lcoation
   * @param  {function} callback
   */
  registerLogger: function (mrcFilename) {
    const logFile = fs.createWriteStream(`${mrcFilename}.log`, { flags: 'w' })
    const logStdout = process.stdout

    console.logToFile = function () {
      logFile.write(util.format.apply(null, arguments) + '\n')
      logStdout.write(util.format.apply(null, arguments) + '\n')
    }
  },

  /**
   * Load the barcode file and hold it as a lookup in memory

   * @param  {string} barcodeFile - the file lcoation
   * @param  {function} callback
   */
  loadBarcodes: function (barcodeFile, callback) {
    var self = this
    var c = 0

    H(fs.createReadStream(barcodeFile))
      .split()
      .map((line) => {
        c++
        if (c % 10000 === 0) process.stdout.write(`Barcode Load: ${c.toString()}` + '\r')

        var commaSplit = line.split(',')
        if (commaSplit[1] && commaSplit[3]) {
          var barcode = commaSplit[1].replace(/"/g, '')
          var customerCode = commaSplit[3].replace(/"/g, '')
          if (!isNaN(barcode) && customerCode.length === 2) {
            self.barcodes.set(parseInt(barcode), customerCode)
          }
        }
      })
      .done(() => {
        process.stdout.write('\nBarcodes Loaded\n')
        callback()
      })
  },

  /**
   * Given a subfield array it will extract the requested subfields into an object of arrays with the index being the code

   * @param  {array} subfields - The subfield array
   * @returns {object} su - the bnumber
   */
  convertSubfields: function (subfields) {
    var results = {}

    subfields.forEach((sf) => {
      var code = Object.keys(sf)[0]
      if (!results[code]) results[code] = []
      results[code].push(sf[code])
    })

    return results
  },

  /**
   * Retruns an array of given fields

   * @param  {object} fields - the fields array from the mij object
   * @param  {array} fields - the fields requested
   * @returns {object} - the converted object
   */
  convertFields: function (fields, requestedFields) {
    var results = {}
    if (typeof requestedFields === 'string') requestedFields = [requestedFields]
    requestedFields = requestedFields.map((f) => {
      return f.toString()
    })
    fields.forEach((field) => {
      var thisField = Object.keys(field)[0].toString()
      if (requestedFields.indexOf(thisField) > -1) {
        if (!results[thisField]) results[thisField] = []
        results[thisField].push(field[thisField])
      }
    })
    return results
  },

  /**
   * Given a marc record it will convert to json and add its size in bytes as a property

   * @param  {record} record - the record decoded from the MARC library
   * @returns {object} - the converted object
   */
  convertToJsonCheckSize: function (record) {
    var mij = record.toMiJ()
    var recordOrginal = record
    var recordBinary = marc.Iso2709Writer.format(record)
    var recordSize = Buffer.byteLength(recordBinary, 'utf8')
    return {mij: mij, recordOrginal: recordOrginal, recordBinary: recordBinary, recordSize: recordSize}
  },

  /**
   * Given the MARC in JSON represntation it will extract the bnumber

   * @param  {object} mij - the M-in-J rep
   * @returns {string} bnumber - the bnumber
   */
  extractBnumber: function (mij) {
    var self = this
    var field907 = this.convertFields(mij.fields, '907')
    // there is only one 907 if present
    if (field907['907'] && field907['907'][0]) field907['907'] = field907['907'][0]

    if (field907['907'] && field907['907'].subfields) {
      var subfields = self.convertSubfields(field907['907'].subfields)
      if (subfields['a'] && subfields['a'][0]) {
        return subfields['a'][0]
      }
    }
    return false
  },

  /**
   * Given the MARC in JSON represntation it will extract the OCLC number

   * @param  {object} mij - the M-in-J rep
   * @returns {string} OCLC - the OCLC
   */
  extractOclc: function (mij) {
    var self = this
    var field = this.convertFields(mij.fields, '991')
    // there is only one 907 if present
    if (field['991'] && field['991'][0]) field['991'] = field['991'][0]

    if (field['991'] && field['991'].subfields) {
      var subfields = self.convertSubfields(field['991'].subfields)
      if (subfields['y'] && subfields['y'][0]) {
        return subfields['y'][0]
      }
    }
    return false
  },
  /**
   * Given the MARC in JSON represntation it will extract the Bib level call number number

   * @param  {object} mij - the M-in-J rep
   * @returns {array} bnumber - the bnumber
   */
  extractBibCallNumber: function (mij) {
    var self = this
    var results = []
    var field = this.convertFields(mij.fields, '952')

    if (field[952]) {
      field[952].forEach((aField) => {
        if (aField.subfields) {
          var subfields = self.convertSubfields(aField.subfields)
          if (subfields['h'] && subfields['h'][0]) results.push(subfields['h'][0])
        }
      })
    }

    return results
  },

  /**
   * Given the MARC in JSON represntation it will extract the item subfields

   * @param  {object} mij - the M-in-J rep
   * @returns {object} results - object, key is field number, array of subfieds
   */
  extractItemFields: function (mij) {
    var self = this
    var fields = this.convertFields(mij.fields, ['852', '876'])

    var results = {
      '852': [],
      '876': []
    }
    Object.keys(fields).forEach((fieldNumber) => {
      fields[fieldNumber].forEach((aField) => {
        if (aField.subfields) {
          var r = self.convertSubfields(aField.subfields)
          if (r) results[fieldNumber].push(r)
        }
      })
    })

    return results
  },

  /**
   * Given the MARC in JSON represntation it will extract the holdings 866 subfields

   * @param  {object} mij - the M-in-J rep
   * @returns {object} results - object, key is field number, array of subfieds
   */
  extractHoldingFields: function (mij) {
    var self = this
    var fields = this.convertFields(mij.fields, ['866'])

    var results = {
      '866': []
    }
    Object.keys(fields).forEach((fieldNumber) => {
      fields[fieldNumber].forEach((aField) => {
        if (aField.subfields) {
          var r = self.convertSubfields(aField.subfields)
          if (r) results[fieldNumber].push(r)
        }
      })
    })

    return results
  },

  /**
   * Given the MARC in JSON represntation it will extract the data

   * @param  {object} mij - the M-in-J rep
   * @returns {array} fields - the array of control fields in mij format
   */
  extractDataFields: function (mij) {
    var results = []
    mij.fields.forEach((field) => {
      var number = parseInt(Object.keys(field)[0])
      if (number > 9 && [866, 852, 876].indexOf(number) === -1) {
        results.push(field)
      }
    })
    // looks like this:
    // [ { '001': 'NYPG003001594-B' },
    //   { '005': '20001116192456.4' },
    //   { '008': '850325s1981    ii a     b    000 1 hin d' } ]

    return results
  },

  /**
   * Given the MARC in JSON represntation it will extract the control fields

   * @param  {object} mij - the M-in-J rep
   * @returns {array} fields - the array of control fields in mij format
   */
  extractControlFields: function (mij) {
    var results = []
    mij.fields.forEach((field) => {
      var number = Object.keys(field)[0]
      if (parseInt(number) < 10) {
        results.push(field)
      }
    })
    // looks like this:
    // [ { '001': 'NYPG003001594-B' },
    //   { '005': '20001116192456.4' },
    //   { '008': '850325s1981    ii a     b    000 1 hin d' } ]

    return results
  },
  /**
   * Given the record record it will make sure the 001 field is correct

   * @param  {object} record - data record
   * @returns {object} record - the whole record with modified controledfields
   */
  fix001: function (record) {
    var field001 = this.convertFields(record.controlFields, ['001'])
    if (!field001['001']) {
      // if there is a oclc number use that and add a 003
      if (record.oclcNumber) {
        record.controlFields.push({ '001': record.oclcNumber })
        record.controlFields.push({ '003': 'OCoLC' })
        var field003 = this.convertFields(record.controlFields, ['003'])
        if (field003['003'].length > 1) {
          console.logToFile(`Too many 003 fields added, ${record.bNumber}`)
        }
      } else if (record.bNumber) {
        record.controlFields.push({ '001': `NYPL${record.bNumber}` })
      }
    }

    return record
  },
  /**
   * Given the record with all the data extracted it will build the final items in xml2js format ready to be exported, index by call number

   * @param  {object} record - the whole record data
   * @returns {object} items - the items by call number index in xml2js format
   */
  buildItems: function (record) {
    var self = this
    var itemIds = []
    var data852 = {}
    var data876 = {}
    record.itemXmlJsObj = {}
    record.locationCodeIndex = {} // kind of hacky

    // convert the arrays of data keyed on .i number
    record.itemData['852'].forEach((item) => {
      if (item['a']) {
        if (itemIds.indexOf(item['a'][0]) === -1) itemIds.push(item['a'][0])
        if (!data852[item['a'][0]]) data852[item['a'][0]] = {}
        Object.keys(item).forEach((code) => {
          data852[item['a']][code] = item[code][0]
        })
      } else {
        console.logToFile(`852 missing inumber,${record.bNumber}`)
      }
    })

    record.itemData['876'].forEach((item) => {
      if (item['a']) {
        if (itemIds.indexOf(item['a'][0]) === -1) itemIds.push(item['a'][0])
        if (!data876[item['a'][0]]) data876[item['a'][0]] = {}
        Object.keys(item).forEach((code) => {
          data876[item['a']][code] = item[code][0]
        })
      } else {
        console.logToFile(`876 missing inumber,${record.bNumber}`)
      }
    })

    // loop through each item and build the final item object
    itemIds.forEach((i) => {
      // we want to exlude some items here because they are not supposed to be in the extract because they are not ReCAP or other reasons
      if (data852[i] && data876[i]) {
        // check if this is a ReCAP item
        if (data852[i].b && data876[i].k) {
          if (data852[i].b.substring(0, 2) !== 'rc' || data876[i].k.substring(0, 2) !== 'rc') {
            return false
          }
        } else {
          if (!data852[i].b) {
            console.logToFile(`852|b missing,${i} in ${record.bNumber}`)
          } else {
            console.logToFile(`876|k missing,${i} in ${record.bNumber}`)
          }
          return false
        }

        // check if it has bad values we are exluding for now
        if (data852[i].y && [43, 209].indexOf(parseInt(data852[i].y)) > -1) {
          if (data876[i].s && [43, 209].indexOf(parseInt(data876[i].s)) > -1) {
            return false
          }
        }
      } else {
        if (!data852[i]) {
          console.logToFile(`852 missing,${i} in ${record.bNumber}`)
        } else {
          console.logToFile(`876 missing,${i} in ${record.bNumber}`)
        }
        return false
      }

      // if it got here all the data is good and we want to hopefully turn it into an item
      // check the barcode and get the customer codes
      if (!data876[i].p) {
        console.logToFile(`Missing barcode: no 876|p, ${i} in ${record.bNumber}`)
        return false
      } else {
        var customerCode = self.barcodes.get(parseInt(data876[i].p))
        if (!customerCode) {
          console.logToFile(`Barcode not found in lookup file, ${data876[i].p}, item: ${i} in ${record.bNumber}`)
          return false
        }
      }

      var useRestriction = self.buildUseRestriction(data852[i], data876[i], customerCode)

      // build the basic structure, we know we have the barcode
      var new876 = {
        $: {
          ind1: ' ',
          ind2: ' ',
          tag: '876'
        },
        subfield: [
          {
            _: data876[i].p,
            $: { code: 'p' }
          }
        ]
      }

      if (useRestriction.groupDesignation) {
        new876.subfield.push({_: useRestriction.groupDesignation, $: {code: 'h'}})
      } else {
        console.error(`groupDesignation not found, ${i}`)
      }

      if (data876[i].a) {
        new876.subfield.push({_: data876[i].a, $: {code: 'a'}})
      } else {
        console.error(`Missing 876|a,${i}`)
      }

      if (data876[i].j) {
        new876.subfield.push({_: data876[i].j, $: {code: 'j'}})
      } else {
        console.error(`Missing 876|j,${i}`)
      }

      if (data876[i].t) {
        new876.subfield.push({_: data876[i].t, $: {code: 't'}})
      } else {
        console.error(`Missing 876|t,${i}`)
      }

      if (data852[i]['3']) {
        new876.subfield.push({_: data852[i]['3'], $: {code: '3'}})
      } else {
        // this is very common
        // console.error(`Missing 852|3,${i}`)
      }

      // the middleware Item is composed of the 876 and a 900
      var new900 = {
        $: {
          ind1: ' ',
          ind2: ' ',
          tag: '900'
        },
        subfield: [
          {
            _: useRestriction.useRestriction,
            $: { code: 'a' }
          },
          {
            _: customerCode,
            $: { code: 'b' }
          }
        ]
      }

      // we need to add this in by callnumber, if there is no callnumber use the bib level callnumber
      var callnumber = (data852[i].h) ? data852[i].h : record.bibCallNumber[0]

      // if we did not find a callnumber use a fake callnumber based on the bnumber
      if (!callnumber) {
        callnumber = `ReCAP ${record.bNumber}`
      }
      callnumber = callnumber.trim()

      if (!record.itemXmlJsObj[callnumber]) record.itemXmlJsObj[callnumber] = []
      if (!record.locationCodeIndex[callnumber]) record.locationCodeIndex[callnumber] = []

      if (data876[i].k && record.locationCodeIndex[callnumber].indexOf(data876[i].k.trim()) === -1) {
        record.locationCodeIndex[callnumber].push(data876[i].k.trim())
      }

      record.itemXmlJsObj[callnumber].push({'876': new876, '900': new900})
    })

    return record.itemXmlJsObj
  },

  /**
   * Given the record with all the data extracted it will build the final holdings in xml2js format ready to be exported, index by call number

   * @param  {object} record - the whole record data
   * @returns {object} items - the items by call number index in xml2js format
   */
  buildRecord: function (record) {
    var self = this

    // build the general bib
    var bib = this.buildBibRecord(record)
    var holdings = []

    // build the data for each one
    Object.keys(record.items).forEach((callnumber) => {
      var aHolding = self.buildHoldings852and866andItems(record, callnumber)
      holdings.push(aHolding)
    })

    // put it together
    var final = {
      bibRecord: {
        bib: bib,
        holdings: holdings
      }
    }
    return final
  },

  /**
   * Given the record with all the data extracted it will build the bib data consiting of leader/control/data fields in xml2js format

   * @param  {object} record - the whole record data
   * @returns {object} items - the items by call number index in xml2js format
   */
  buildBibRecord: function (record) {
    var bib = {
      owningInstitutionId: 'NYPL',
      owningInstitutionBibId: record.bNumber,
      content: {
        collection: {
          $: {xmlns: 'http://www.loc.gov/MARC21/slim'},
          record: {
            controlfield: [],
            datafield: []

          }
        }
      }

    }

    // the leader
    if (record.mij.leader) bib.content.collection.record.leader = record.mij.leader

    // the control fields
    record.controlFields.forEach((cf) => {
      var tag = Object.keys(cf)[0]
      bib.content.collection.record.controlfield.push({
        _: cf[tag],
        $: {tag: tag}
      })
    })

    // the data fields
    record.dataFields.forEach((df) => {
      var tag = Object.keys(df)[0]

      var newField = {
        $: {
          ind1: df[tag].ind1,
          ind2: df[tag].ind2,
          tag: tag
        },
        subfield: df[tag].subfields.map((sf) => {
          var code = Object.keys(sf)[0]
          return {
            _: sf[code],
            $: { code: code }
          }
        })
      }

      bib.content.collection.record.datafield.push(newField)
    })

    return bib
  },

  /**
   * Given the record with all the data extracted it will build the the holdings 866 and 852 fields

   * @param  {object} record - the whole record data
   * @param  {string} callnumber - Which callnumber do we want to build for?
   * @returns {object} holdingfield - the holding field in xml2js format
   */
  buildHoldings852and866andItems: function (record, callnumber) {
    // the 852 comes from the item
    if (record.items[callnumber]) {
      // build the 866 textual statement if there is any
      var textualHoldings = ''
      var textualHoldingsFromItems = ''
      var holdingsId = ''

      if (record.holdingData['866']) {
        var textualHoldingsAry = []
        var holdingsIdAry = []
        record.holdingData['866'].forEach((h) => {
          if (h.y && h.y[0]) holdingsIdAry.push(h.y[0])
          if (h.a && h.a[0]) textualHoldingsAry.push(h.a[0])
        })
        textualHoldings = textualHoldingsAry.join(', ')
        holdingsId = holdingsIdAry.join('')
      }
    } else {
      console.logToFile(`Missing callnumber in items,${callnumber}`)
    }

    // Also make textualHoldings by using the items data
    textualHoldingsAry = []
    record.items[callnumber].forEach((aItem) => {
      if (aItem['876'] && aItem['876'].subfield) {
        aItem['876'].subfield.forEach((subfield) => {
          if (subfield && subfield.$ && subfield.$.code && subfield.$.code === '3') {
            if (subfield._) textualHoldingsAry.push(subfield._)
          }
        })
      }
    })
    textualHoldingsFromItems = textualHoldingsAry.join(', ')

    // if there is more than one call number we cannot use the holdings information
    if (Object.keys(record.items).length > 1) {
      textualHoldings = ''
      holdingsId = ''
    }

    var aHolding = {
      holding: {
        owningInstitutionHoldingsId: holdingsId,
        content: {
          collection: {
            $: {'xmlns': 'http://www.loc.gov/MARC21/slim'},
            record: [
              {
                datafield: [
                  {
                    $: {
                      ind1: ' ',
                      ind2: '8',
                      tag: '852'
                    },
                    subfield: (() => {
                      var s = []

                      // add in all the locations
                      if (record.locationCodeIndex[callnumber]) {
                        s = record.locationCodeIndex[callnumber].map((location) => {
                          return {
                            _: location,
                            $: { code: 'b' }
                          }
                        })
                      }

                      // and the call number
                      s.push({
                        _: callnumber,
                        $: { code: 'h' }
                      })

                      return s
                    }).call()
                  },
                  {
                    $: {
                      ind1: ' ',
                      ind2: ' ',
                      tag: '866'
                    },
                    subfield: [
                      {
                        _: (textualHoldings !== '') ? textualHoldings : textualHoldingsFromItems,
                        $: { code: 'a' }
                      }
                    ]
                  }
                ]

              }
            ]

          }
        },
        items: {
          content: {
            collection: {
              $: {xmlns: 'http://www.loc.gov/MARC21/slim'},
              record: (() => {
                // build the items here in line
                var items = []
                Object.keys(record.items).forEach((cn) => {
                  record.items[cn].forEach((record) => {
                    items.push({
                      datafield: [record['876'], record['900']]
                    })
                  })
                })
                return items
              }).call()
            }
          }
        }
      }

    }

    // inspect(aHolding)

    return aHolding
  },

  /**
   * PAssed the 852 and 876

   * @param {object} data852 - the 852 data object
   * @param {object} data876 - the 852 data object
   * @returns {object} results - the data object with useRestriction and groupDesignation properties
   */
  buildUseRestriction: function (data852, data876, customerCode) {
    // if it has a shared code:
    var cgdShared = ['GN', 'JN', 'JS', 'NA', 'NB', 'NW']
    // the private codes: JO, ND, NH, NL, NN, NO, NP, NQ, NR, NS, NU, NV, NX, NZ

    var results = {useRestriction: 'Supervised Use', groupDesignation: (cgdShared.indexOf(customerCode) > -1) ? 'Shared' : 'Private'}

    if (data876.o.toString() === '2') {
      if ([211, 212, 210, 214, 215, 227].indexOf(parseInt(data876.s)) !== -1) {
        if ([55, 57].indexOf(parseInt(data876.y)) !== -1) {
          results.useRestriction = ''
          return results
        }
      }
    }
    if (['4', 'a', 'p', 'u'].indexOf(data876.o.toString()) !== -1) {
      if ([211, 212, 210, 214, 215, 227].indexOf(parseInt(data876.s)) !== -1) {
        results.useRestriction = 'Supervised Use'
        return results
      }
    }
    if (data876.o.toString() === '2') {
      if ([211, 212, 210, 214, 215, 227].indexOf(parseInt(data876.s)) !== -1) {
        if ([2, 3, 4, 5, 6, 7, 25, 26, 32, 33, 34, 35, 42, 43, 52, 53, 60, 61, 65, 67].indexOf(parseInt(data876.y)) !== -1) {
          results.useRestriction = 'In Library Use'
          return results
        }
      }
    }
    if (data876.o.toString() === '2') {
      if ([213, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 228, 230].indexOf(parseInt(data876.s)) !== -1) {
        results.useRestriction = 'Supervised Use'
        return results
      }
    }
    return results
  },

  /**
   * Given the MARC in JSON represntation it will extract the bnumber

   * @param  {object} mij - the M-in-J rep
   * @returns {string} bnumber - the bnumber
   */
  template: function (mij) {}

}
