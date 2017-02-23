'use strict'
module.exports = {
  /**
   * Modifiy a Sierra Bib API response to get ready to convert to MiJ format
   * It changes some of the fields to match the export table output for the bulk output
   *
   * @param  {object} bibObj - The JSON response from the Sierra API
   * @returns {object} - The modified object
   */
  modifyBib: function (bibObj) {
    // Rename the bib level 852 fields to 952
    for (var x in bibObj.varFields) {
      if (bibObj.varFields[x].marcTag && bibObj.varFields[x].marcTag.toString() === '852') {
        bibObj.varFields[x].marcTag = '952'
      }
      if (!bibObj.varFields[x].marcTag) {
        if (bibObj.varFields[x].fieldTag && bibObj.varFields[x].fieldTag === '_') {
          bibObj.leader = bibObj.varFields[x].content
        }
        delete bibObj.varFields[x]
      }
    }
    // we want to make the bnumber in 907|a
    bibObj.varFields.push({
      'fieldTag': 'y',
      'ind1': '0',
      'ind2': '0',
      'marcTag': '907',
      'subfields': [
        {
          'content': `.b${this.mod11(bibObj.id)}`,
          'tag': 'a'
        }
      ]
    })
    return bibObj
  },
  /**
   * Given a Sierra Bib API it will turn it into marc in json format expected by the rest of the parsers (what comes out of the marcjs library)
   *
   * @param  {object} bibObj - The JSON response from the Sierra API
   * @returns {object} - The mij format
   */
  convertToMiJFormat: function (bibObj) {
    var results = {
      leader: '',
      fields: []
    }

    bibObj.varFields.forEach((f) => {
      var newField = {}

      if (f.content) {
        newField[f.marcTag] = f.content
      } else {
        newField[f.marcTag] = {}
        if (f.ind1) newField[f.marcTag].ind1 = f.ind1
        if (f.ind2) newField[f.marcTag].ind2 = f.ind2
        if (f.subfields) {
          newField[f.marcTag].subfields = []
          f.subfields.forEach((sf) => {
            var newSf = {}
            newSf[sf.tag] = sf.content
            newField[f.marcTag].subfields.push(newSf)
          })
        }
      }
      results.fields.push(newField)
    })
    results.leader = bibObj.leader

    return results
  },

  /**
   * Given an array of sierra item turns them into formated 852 and 876 fields
   *
   * @param  {array} items - array of JSON responses from the Sierra item API
   * @returns {object} - The mij format
   */
  convertItemsToMiJ: function (items) {
    var self = this
    var results = []
    // the 852 should have:
    // |a item number, from the item header in the format .i123456789 (with mod11 check)
    // |b location, comes from location.code
    // |h call number, comes from  callNumber with |h removed from the start
    // |y agency, come from fixedFields['127'].value (ItemAgency)
    // |3 extent, comes from  fieldTag "v" (hopefully)

    items.forEach((item) => {
      var new852 = {
        '852': {
          'ind1': ' ',
          'ind2': ' ',
          'subfields': []
        }
      }

      new852['852'].subfields.push({'a': self.mod11(`.i${item.id}`)})
      if (item.location && item.location.code) new852['852'].subfields.push({'b': item.location.code.trim()})
      if (item.callNumber) {
        item.callNumber = item.callNumber.trim().replace('|h', '')
        new852['852'].subfields.push({'h': item.callNumber})
      }
      if (item.fixedFields && item.fixedFields['127'] && item.fixedFields['127'].value) {
        new852['852'].subfields.push({'y': item.fixedFields['127'].value.trim()})
      }
      if (item.varFields) {
        item.varFields.forEach((f) => {
          if (f.fieldTag && f.fieldTag.trim() === 'v' && f.content) {
            new852['852'].subfields.push({'3': f.content.toString().trim()})
          }
        })
      }

      // the 876 should have:
      // |a item number, from the item header in the format .i123456789 (with mod11 check)
      // |j status, from status.code
      // |k location, comes from location.code
      // |o OPACMessage, comes from fixedFields['108'].value (OPACMessage)
      // |p barcode, comes from item.barcode
      // |s agency, come from fixedFields['127'].value (ItemAgency)
      // |t copy number, comes from fixedFields['58'].value (CopyNo.)
      // |y item type, comes from fixedFields['61'].value (ItemType)

      var new876 = {
        '876': {
          'ind1': ' ',
          'ind2': ' ',
          'subfields': []
        }
      }

      new876['876'].subfields.push({'a': self.mod11(`.i${item.id}`)})
      if (item.location && item.location.code) new876['876'].subfields.push({'k': item.location.code.trim()})
      if (item.status && item.status.code) {
        new876['876'].subfields.push({'j': item.status.code.trim()})
      }
      if (item.fixedFields && item.fixedFields['108'] && item.fixedFields['108'].value) {
        new876['876'].subfields.push({'o': item.fixedFields['108'].value.trim()})
      }
      if (item.barcode) new876['876'].subfields.push({'p': item.barcode.trim()})
      if (item.fixedFields && item.fixedFields['127'] && item.fixedFields['127'].value) {
        new876['876'].subfields.push({'s': item.fixedFields['127'].value.trim()})
      }
      if (item.fixedFields && item.fixedFields['58'] && item.fixedFields['58'].value) {
        new876['876'].subfields.push({'t': item.fixedFields['58'].value})
      }
      if (item.fixedFields && item.fixedFields['61'] && item.fixedFields['61'].value) {
        new876['876'].subfields.push({'y': item.fixedFields['61'].value.trim()})
      }

      results.push(new852)
      results.push(new876)
    })

    return results
  },

  /**
   * a bib/item/holdings number it will return it with a sierra version of mod11
   *
   * @param  {string} bnumber - The bnumber or inumber
   * @returns {string} - the bnumber with check digit
   */

  mod11: function (bnumber) {
    var ogBnumber = bnumber
    bnumber = bnumber.toString().replace(/\.b/, '').replace(/\.c/, '').replace(/\.i/, '').replace(/b/, '').replace(/c/, '').replace(/i/, '')
    var results = []
    var multiplier = 2
    for (var digit of bnumber.split('').reverse().join('')) {
      results.push(parseInt(digit) * multiplier++)
    }

    var remainder = results.reduce(function (a, b) { return a + b }, 0) % 11

    // OMG THIS IS WRONG! Sierra doesn't do mod11 riggghhttttt
    // remainder = 11 - remainder

    if (remainder === 11) return `${ogBnumber}0`
    if (remainder === 10) return `${ogBnumber}x`

    return `${ogBnumber}${remainder}`
  }

}
