'use strict'
const H = require('highland')
const fs = require('fs')
const xml2js = require('xml2js')
const parseString = xml2js.parseString
const stripPrefix = xml2js.processors.stripPrefix
const builder = new xml2js.Builder({headless: true})
const inspect = require('eyes').inspector({maxLength: false})

const util = require('util')
const logFile = fs.createWriteStream('data/last_run.log', { flags: 'w' })
const logStdout = process.stdout

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n')
  logStdout.write(util.format.apply(null, arguments) + '\n')
}

console.error = console.log

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
   * Passed a XML string and callback it will parse it with xml2js and return the object

   * @param  {string} xmlBlob - the XML string
   * @param  {function} callback
   */
  parse: function (xmlBlob, callback) {
    parseString(xmlBlob, {tagNameProcessors: [stripPrefix]}, (err, result) => {
      if (err) console.error(err)
      callback(err, result)
    })
  },

  /**
   * Passed the xml JS object it will do the operations to extract the data and build the data required to seralize into the XML record

   * @param {object} xmlJsObj - the XML string
   * @returns {object} - the data object
   */
  extractData: function (xmlJsObj) {
    var data = {
      has001ControlNumber: false, // does it have a 001 control number?
      has001ControlNumber991y: false, // does it have the control number in 991|y ?
      has001ControlNumber907a: false, // does it have the control number in 907|a ?
      fakeHoldings852TextHoldings: {}, // the array of strings that could make up a fake textual holdings, the index is the call number
      fakeHoldings852Locations: {}, // the array of strings that could make up a fake location holdings, the index is the call number
      bibCallNumber: [], // if the item does not have a call number we will fallback on the bib callnumber
      valueFor876h: false,
      valueFor900a: false,
      valueFor900b: false,

      xmlJsObj: xmlJsObj,

      // these are the fields that make the bib record
      recordControlFields: xmlJsObj.record.controlfield,
      recordLeader: xmlJsObj.record.leader,
      recordDataFields: [],

      holdings866: [],
      holdings866Data: {},
      holdingsXmlObj: [],
      items852: [], // the raw item date
      items876: [],
      itemIds: [], // all the item ids found
      item852Data: {}, // the extracted item data
      item876Data: {},
      items: {}, // the new items grouped together by callnumber
      itemsCount: 0
    }

    // the control fields
    data.xmlJsObj.record.controlfield.forEach((df) => {
      // does it have a 001?
      if (df && df['$'] && df['$'].tag) {
        if (df['$'].tag === '001') {
          data.has001ControlNumber = df._
        }
      }
    })

    // the datafields
    data.xmlJsObj.record.datafield.forEach((df) => {
      if (df && df['$'] && df['$'].tag) {
        // the 907|a
        if (df['$'].tag === '907') {
          if (df.subfield) {
            df.subfield.forEach((s) => {
              if (s && s['$'] && s['$'].code && s['$'].code === 'a') {
                if (s._) data.has001ControlNumber907a = s._
              }
            })
          }
        }
        // the 991|y
        if (df['$'].tag === '991') {
          if (df.subfield) {
            df.subfield.forEach((s) => {
              if (s && s['$'] && s['$'].code && s['$'].code === 'y') {
                if (s._) data.has001ControlNumber991y = s._
              }
            })
          }
        }

        // the 952|h
        if (df['$'].tag === '952') {
          if (df.subfield) {
            df.subfield.forEach((s) => {
              if (s && s['$'] && s['$'].code && s['$'].code === 'h') {
                // if (s._) data.has001ControlNumber991y = s._
                if (s._) data.bibCallNumber.push(s._)
              }
            })
          }
        }

        // if it is not one of the item fields add it to the bib data fields
        if (['852', '876', '866'].indexOf(df['$'].tag) === -1) {
          data.recordDataFields.push(df)
        }

        // the save the 852 and 876 to process
        if (df['$'].tag === '852') {
          // Exluding Items!
          // make sure it is a recap 852 item, do not keep it the location code does not start with 'rc'
          if (df.subfield) {
            df.subfield.forEach((dfsf) => {
              if (dfsf['$'] && dfsf['$'].code && dfsf['$'].code === 'b') {
                if (dfsf._.substring(0, 2) === 'rc') {
                  data.items852.push(df)
                }
              }
            })
          }
        }
        // Exluding Items!
        // make sure it is a recap 876 item, do not keep it the location code does not start with 'rc'
        if (df['$'].tag === '876') {
          if (df.subfield) {
            df.subfield.forEach((dfsf) => {
              if (dfsf['$'] && dfsf['$'].code && dfsf['$'].code === 'k') {
                if (dfsf._.substring(0, 2) === 'rc') {
                  data.items876.push(df)
                }
              }
            })
          }
        }
        if (df['$'].tag === '866') {
          data.holdings866.push(df)
        }
      }
    })

    data = this.fix001(data)
    data = this.extract852(data)
    data = this.extract876(data)
    data = this.buildItems(data)
    data = this.buildHoldings(data)

    if (!data) {
      console.log('Critical ERROR!')
      inspect(xmlJsObj)
      data = {}
      data.xml = ''
      return data
    }

    // put it all together
    var record = Object.assign(this.recordLayout)
    if (!data.has001ControlNumber907a) {
      console.error('No bnumber,', 'control number:', data.has001ControlNumber)
    }

    // the b number
    record.bibRecord.bib.owningInstitutionBibId = data.has001ControlNumber907a

    // where the bib will live
    record.bibRecord.bib.content = {
      collection: {
        $: { xmlns: 'http://www.loc.gov/MARC21/slim' },
        record: {}
      }
    }

    record.bibRecord.bib.content.collection.record.leader = data.recordLeader
    record.bibRecord.bib.content.collection.record.controlfield = data.recordControlFields
    record.bibRecord.bib.content.collection.record.datafield = data.recordDataFields
    record.bibRecord.holdings.holding = data.holdingsXmlObj
    if (data.itemsCount === 0) {
      console.error('No Items,', data.has001ControlNumber907a)
      data.xml = ''
    } else {
      try {
        data.xml = builder.buildObject(record)
      } catch (e) {
        console.error('Error building SCSB XML,', data.has001ControlNumber907a, e)
        data.xml = ''
      }
    }

    return data
  },

  /**
   * Will merge the item fields together by callnumber

   * @param {object} data - the data object from the process function
   * @returns {object} data - the data object
   */
  buildItems: function (data) {
    var self = this
    data.itemIds.forEach((id) => {
      // do we have the data for this item?
      if (data.item852Data[id] && data.item876Data[id]) {
        // Exluding Items!
        // Another exlusion, do not add this as an item if it matches this
        if (data.item852Data[id].y && [43, 209].indexOf(parseInt(data.item852Data[id].y)) > -1) {
          if (data.item876Data[id].s && [43, 209].indexOf(parseInt(data.item876Data[id].s)) > -1) {
            return false
          }
        }

        // check the barcode and get the customer codes
        if (!data.item876Data[id].p) {
          console.error('Missing barcode: no 876|p,', id, ' in ', data.has001ControlNumber907a)
          return false
        } else {
          var customerCode = self.barcodes.get(parseInt(data.item876Data[id].p))
          if (!customerCode) {
            console.error('Barcode not found in lookup file,', data.item876Data[id].p, ' item:', id, ' in ', data.has001ControlNumber907a)
            return false
          }
        }

        var useRestriction = self.buildUseRestriction(data.item852Data[id], data.item876Data[id], customerCode)

        // build the basic structure, we know we have the barcode
        var new876 = {
          $: {
            ind1: ' ',
            ind2: ' ',
            tag: '876'
          },
          subfield: [
            {
              _: data.item876Data[id].p,
              $: { code: 'p' }
            }
          ]
        }

        if (useRestriction.groupDesignation) {
          new876.subfield.push({_: useRestriction.groupDesignation, $: {code: 'h'}})
        } else {
          console.error('groupDesignation not found,', id)
        }

        if (data.item876Data[id].a) {
          new876.subfield.push({_: data.item876Data[id].a, $: {code: 'a'}})
        } else {
          console.error('Missing 876|a,', id)
        }

        if (data.item876Data[id].j) {
          new876.subfield.push({_: data.item876Data[id].j, $: {code: 'j'}})
        } else {
          console.error('Missing 876|j,', id)
        }

        if (data.item876Data[id].t) {
          new876.subfield.push({_: data.item876Data[id].t, $: {code: 't'}})
        } else {
          console.error('Missing 876|t,', id)
        }

        if (data.item852Data[id]['3']) {
          new876.subfield.push({_: data.item852Data[id]['3'], $: {code: '3'}})
        } else {
          // console.error(id, ' is missing 852|3')
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
        var callnumber = (data.item852Data[id].h) ? data.item852Data[id].h : data.bibCallNumber[0]

        // if we did not find a callnumber use a fake callnumber based on the bnumber
        if (!callnumber) {
          callnumber = `ReCAP ${data.has001ControlNumber907a}`
        }

        if (!data.items[callnumber]) data.items[callnumber] = []
        data.items[callnumber].push({'876': new876, '900': new900})
        data.itemsCount++

      // inspect(data.items)
      } else {
        if (!data.item852Data[id]) {
          console.error('Missing 852 item field,', id)
        } else {
          console.error('Missing 876 item field,', id)
        }
      }
    })

    return data
  },

  /**
   * Wil build the 866 field if the 866 field is present or construct a fake one from item data

   * @param {object} data - the data object from the process function
   * @returns {object} data - the data object
   */
  buildHoldings: function (data) {
    // if it has a holdings record put all of the items under that holdings record
    var locationCode = null
    var holdings866y = ''
    var holdings866a = ''

    if (data.holdings866[0]) {
      data.holdings866[0].subfield.forEach((sf) => {
        if (sf['$'] && sf['$'].code && sf['$'].code === 'y') holdings866y = sf._
        if (sf['$'] && sf['$'].code && sf['$'].code === 'a') holdings866a = sf._
      })

      if (data.holdings866.length > 1) {
        // console.error('WARN: Multiple 866, will build custom textual holdings extent 866|a,', data.has001ControlNumber907a)
        holdings866a = false
      }
      if (!holdings866a) {
        var allHoldings = []
        Object.keys(data.items).forEach((callNumber) => {
          if (data.fakeHoldings852TextHoldings[callNumber]) {
            allHoldings = allHoldings.concat(data.fakeHoldings852TextHoldings[callNumber])
          }
        })
        if (allHoldings.length > 0) {
          holdings866a = allHoldings.join(', ')
        } else {
          holdings866a = ''
        }
      }

      // we are using the first callNumber from the items list
      var callNumber = Object.keys(data.items)[0]
      if (!callNumber) {
        console.error('Does not have a callNumber to go with the holdings/items,', data.has001ControlNumber907a)
        return data
      }

      // grab the location code from the first item
      locationCode = data.item852Data[Object.keys(data.item852Data)[0]].b
      if (!locationCode) locationCode = data.item876Data[Object.keys(data.item876Data)[0]].k
      if (!locationCode) {
        console.error('Does not have a location Code to go with the holdings/items,', data.has001ControlNumber907a)
        return data
      }

      data.holdingsXmlObj = [
        {
          owningInstitutionHoldingsId: holdings866y,
          content: {
            collection: {
              $: {'xmlns': 'http://www.loc.gov/MARC21/slim'},
              record: [
                {
                  datafield: [
                    {
                      $: {
                        ind1: ' ',
                        ind2: ' ',
                        tag: '852'
                      },
                      subfield: [
                        {
                          _: locationCode,
                          $: { code: 'b' }
                        },
                        {
                          _: callNumber,
                          $: { code: 'h' }
                        }
                      ]
                    },
                    {
                      $: {
                        ind1: ' ',
                        ind2: ' ',
                        tag: '866'
                      },
                      subfield: [
                        {
                          _: holdings866a,
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
                  Object.keys(data.items).forEach((cn) => {
                    data.items[cn].forEach((record) => {
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

      ]

    // use the callnumber from the bib level to make this holdings record
    } else {
      // we need to build a holdings for each callnumber we have
      Object.keys(data.items).forEach((callNumber) => {
        // grab the location code from the first item
        if (data.fakeHoldings852Locations[callNumber]) locationCode = data.fakeHoldings852Locations[callNumber][0]
        if (data.fakeHoldings852TextHoldings[callNumber]) {
          holdings866a = data.fakeHoldings852TextHoldings[callNumber].join(', ')
        } else {
          holdings866a = ''
        }
        if (!locationCode) {
          console.error('Does not have a location Code to go with the holdings/items,', data.has001ControlNumber907a)
          return
        }

        data.holdingsXmlObj.push(
          {
            owningInstitutionHoldingsId: null, // no holdings id if we are faking it
            content: {
              collection: {
                $: {'xmlns': 'http://www.loc.gov/MARC21/slim'},
                record: [
                  {
                    datafield: [
                      {
                        $: {
                          ind1: ' ',
                          ind2: ' ',
                          tag: '852'
                        },
                        subfield: [
                          {
                            _: locationCode,
                            $: { code: 'b' }
                          },
                          {
                            _: callNumber,
                            $: { code: 'h' }
                          }
                        ]
                      },
                      {
                        $: {
                          ind1: ' ',
                          ind2: ' ',
                          tag: '866'
                        },
                        subfield: [
                          {
                            _: holdings866a,
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
                    data.items[callNumber].forEach((record) => {
                      items.push({
                        datafield: [record['876'], record['900']]
                      })
                    })
                    return items
                  }).call()
                }
              }
            }

          }

        )
      })
    }
    return data
  },

  /**
   * Passed the data object it extract the 852 data into a lookup object by .i number

   * @param {object} data - the data object from the process function
   * @returns {object} data - the data object
   */
  extract852: function (data) {
    data.items852.forEach((a852) => {
      // inspect(a852)
      var itemNumber = a852.subfield.map((sf) => {
        if (sf['$'] && sf['$'].code && sf['$'].code === 'a') {
          return sf._
        }
      })
      // we need the .i number first to assign the other data to
      if (itemNumber[0] && itemNumber[0].substring(0, 2) === '.i') {
        itemNumber = itemNumber[0]
      } else {
        itemNumber = false
      }
      if (itemNumber) {
        if (data.itemIds.indexOf(itemNumber) === -1) data.itemIds.push(itemNumber)
        data.item852Data[itemNumber] = { 'b': false, 'h': false, '3': false, 'y': false }
        a852.subfield.forEach((sf) => {
          if (sf['$'] && sf['$'].code && sf['$'].code === 'b') data.item852Data[itemNumber].b = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'h') data.item852Data[itemNumber].h = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === '3') data.item852Data[itemNumber]['3'] = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'y') data.item852Data[itemNumber].y = sf._
        })
        // we don't have a callnumber at this level use the bib level call number
        var cn = (data.item852Data[itemNumber].h) ? data.item852Data[itemNumber].h : data.bibCallNumber[0]

        if (!cn) {
          cn = `ReCAP ${data.has001ControlNumber907a}`
        }

        // see if we can add this to the holdings textual holdings information
        // we store them as an array based on callnumber because it goes at the holdings level in this schema
        if (data.item852Data[itemNumber]['3']) {
          if (cn) {
            if (!data.fakeHoldings852TextHoldings[cn]) data.fakeHoldings852TextHoldings[cn] = []
            if (data.fakeHoldings852TextHoldings[cn].indexOf(data.item852Data[itemNumber]['3']) === -1) data.fakeHoldings852TextHoldings[cn].push(data.item852Data[itemNumber]['3'])
          } else {
            console.error('No callnumber could be used for this item,', itemNumber)
          }
        }
        // also store the location by callnumber for later in the holdings record
        if (data.item852Data[itemNumber].b) {
          if (cn) {
            if (!data.fakeHoldings852Locations[cn]) data.fakeHoldings852Locations[cn] = []
            if (data.fakeHoldings852Locations[cn].indexOf(data.item852Data[itemNumber].b) === -1) data.fakeHoldings852Locations[cn].push(data.item852Data[itemNumber].b)
          } else {
            console.error('No callnumber could be used for this item,', itemNumber)
          }
        }
      } else {
        console.error('Has no .i number,', a852)
      }
    })

    return data
  },

  /**
   * Passed the data object it extract the 876 data into a lookup object by .i number

   * @param {object} data - the data object from the process function
   * @returns {object} data - the data object
   */
  extract876: function (data) {
    data.items876.forEach((a876) => {
      // inspect(a876)
      var itemNumber = a876.subfield.map((sf) => {
        if (sf['$'] && sf['$'].code && sf['$'].code === 'a') {
          return sf._
        }
      })
      // we need the .i number first to assign the other data to
      if (itemNumber[0] && itemNumber[0].substring(0, 2) === '.i') {
        itemNumber = itemNumber[0]
      } else {
        itemNumber = false
      }
      if (itemNumber) {
        if (data.itemIds.indexOf(itemNumber) === -1) data.itemIds.push(itemNumber)
        data.item876Data[itemNumber] = {o: false, s: false, y: false, a: false, j: false, p: false, t: false}
        a876.subfield.forEach((sf) => {
          if (sf['$'] && sf['$'].code && sf['$'].code === 'o') data.item876Data[itemNumber].o = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 's') data.item876Data[itemNumber].s = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'y') data.item876Data[itemNumber].y = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'a') data.item876Data[itemNumber].a = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'j') data.item876Data[itemNumber].j = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 'p') data.item876Data[itemNumber].p = sf._
          if (sf['$'] && sf['$'].code && sf['$'].code === 't') data.item876Data[itemNumber].t = sf._
        })
      } else {
        console.error('Has no .i number,', a876)
      }
    })

    return data
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
   * Passed the data object it will fix a missing 001 field

   * @param {object} data - the data object from the process function
   * @returns {object} data - the data object
   */
  fix001: function (data) {
    // if there is no 001 fix it
    if (!data.has001ControlNumber) {
      // we need to make a 001
      if (data.has001ControlNumber991y) {
        data.recordControlFields.push({
          _: `${data.has001ControlNumber991y}`,
          $: { tag: '001' }
        })
        data.recordControlFields.push({
          _: 'OCoLC',
          $: { tag: '003' }
        })
      } else if (!data.has001ControlNumber991y && data.has001ControlNumber907a) {
        data.recordControlFields.push({
          _: `NYPL${data.has001ControlNumber907a}`,
          $: { tag: '001' }
        })
      } else {
        console.error('No 001 value')
      }
    }
    return data
  }

}
