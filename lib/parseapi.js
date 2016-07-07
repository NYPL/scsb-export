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
