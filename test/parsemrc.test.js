/* global describe, it */

'use strict'
const assert = require('assert') // eslint-disable-line
const should = require('should') // eslint-disable-line
const parsLib = require('../lib/parsemrc')
const H = require('highland')
const marc = require('marcjs')
const fs = require('fs')
const inspect = require('eyes').inspector({maxLength: false})
const xml2js = require('xml2js')

inspect(null)

describe('mapUtils lib/utils.js', function () {
  it('It should load the barcode file into memeory', function (done) {
    this.timeout(500000)
    parsLib.loadBarcodes('test/barcode.test.txt', () => {
      parsLib.barcodes.get(33433019861248).should.equal('JN')
      parsLib.barcodes.get(33433003661778).should.equal('NA')
      done()
    })
  })
  it('It should parse a marc file record and set the size, binary, and js objs', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_too_large_record.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        record.recordSize.should.equal(99938)
        record.mij.should.be.type('object')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract subfieds array into an object', function () {
    var subfields = [
      { a: '.i10000507x' },
      { j: '-' },
      { k: 'rcma2' },
      { o: '2' },
      { p: '33433015079225' },
      { s: '214' },
      { t: '1' },
      { y: '2' },
      { y: '22' }
    ]
    var r = parsLib.convertSubfields(subfields)
    r.a[0].should.equal('.i10000507x')
    r.y[0].should.equal('2')
    r.y[1].should.equal('22')
  })
  it('It should extract fields array into an object', function () {
    var fields = [ { '001': 'NYPG92-S7029' },
      { '003': 'CStRLIN' },
      { '005': '19990702101518.0' },
      { '008': '921223c19909999nyubr1p       0    0eng d' },
      { '010': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '022': { subfields: 'TEST', ind1: '0', ind2: ' ' } },
      { '030': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '032': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '035': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '037': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '040': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '042': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '050': { subfields: 'TEST', ind1: '0', ind2: '0' } },
      { '082': { subfields: 'TEST', ind1: '0', ind2: '0' } },
      { '210': { subfields: 'TEST', ind1: '0', ind2: ' ' } },
      { '222': { subfields: 'TEST', ind1: ' ', ind2: '0' } },
      { '245': { subfields: 'TEST', ind1: '0', ind2: '0' } },
      { '260': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '299': { subfields: 'TEST', ind1: '0', ind2: '0' } },
      { '300': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '310': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '362': { subfields: 'TEST', ind1: '0', ind2: ' ' } },
      { '500': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '510': { subfields: 'TEST', ind1: '1', ind2: ' ' } },
      { '650': { subfields: 'TEST', ind1: ' ', ind2: '0' } },
      { '650': { subfields: 'TEST', ind1: ' ', ind2: '0' } },
      { '710': { subfields: 'TEST', ind1: '2', ind2: ' ' } },
      { '780': { subfields: 'TEST', ind1: '0', ind2: '0' } },
      { '799': { subfields: 'TEST', ind1: '0', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '852': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '866': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '866': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '876': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '876': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '876': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '876': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '907': { subfields: 'TEST', ind1: ' ', ind2: ' ' } },
      { '952': { subfields: 'TEST', ind1: ' ', ind2: ' ' } } ]

    var r = parsLib.convertFields(fields, ['952'])
    r['952'][0].subfields.should.equal('TEST')
  })

  it('It should extract the bnumber', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_has_bnumber.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        parsLib.extractBnumber(record.mij).should.equal('.b116512684')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract the OCLC number', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_has_oclc.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        parsLib.extractOclc(record.mij).should.equal('3956490')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract the Bib level call number', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_has_bib_call_number.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        parsLib.extractBibCallNumber(record.mij)[0].should.equal('*ZAN-5298')
        parsLib.extractBibCallNumber(record.mij)[2].should.equal('JFM 04-120')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract control fields', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        var r = parsLib.extractControlFields(record.mij)
        Object.keys(r[0])[0].should.equal('001')
        Object.keys(r[1])[0].should.equal('005')
        Object.keys(r[2])[0].should.equal('008')
        r[0]['001'].should.equal('NYPG003001594-B')
      })
      .done(() => {
        done()
      })
  })
  it('It should convert extracted data into a bib record', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.bibRecord = parsLib.buildBibRecord(record)

        var bibString = JSON.stringify(record.bibRecord)
        // just make sure some things are there, this should really be validated against a schema
        // TODO, write a schema
        bibString.search('NYPG003001594-B').should.be.above(-1)
      })
      .done(() => {
        done()
      })
  })

  it('It should extract data fields', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        var r = parsLib.extractDataFields(record.mij)
        Object.keys(r[0])[0].should.equal('010')
        Object.keys(r[1])[0].should.equal('035')
        Object.keys(r[2])[0].should.equal('035')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract the 866 holdings data', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_866_1.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        var r = parsLib.extractHoldingFields(record.mij)
        r[866].length.should.equal(3)
        r[866][0]['a'][0].should.equal('Online access: covers fall 1994-')
        r[866][1]['y'][0].should.equal('.c10618818')
        r[866][2]['a'][0].should.equal('49(2003)-55(2009).')
      })
      .done(() => {
        done()
      })
  })
  it('It should extract the 852 and 876 data', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        var r = parsLib.extractItemFields(record.mij)
        r[852].length.should.equal(11)
        r[876].length.should.equal(11)
        r[876][0]['a'][0].should.equal('.i100029644')
        r[876][0]['j'][0].should.equal('-')
        r[876][0]['p'][0].should.equal('33433011745316')
      })
      .done(() => {
        done()
      })
  })
  it('It should fix the 001 when there is no OCLC', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_no_001_no_991.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        var field001 = parsLib.convertFields(record.controlFields, ['001'])
        should.not.exist(field001['001'])

        record = parsLib.fix001(record)

        field001 = parsLib.convertFields(record.controlFields, ['001'])
        should.exist(field001['001'])
        field001['001'][0].should.equal('NYPL.b107008191')
      })
      .done(() => {
        done()
      })
  })

  it('It should fix the 001 when there is a OCLC', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_no_001_no_991.mrc')))
      .map((record) => {
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format
        // we need to fake this a little and add in a oclc number since I can't find an example
        record.oclcNumber = '1234567890'
        var field001 = parsLib.convertFields(record.controlFields, ['001'])
        should.not.exist(field001['001'])
        record = parsLib.fix001(record)
        field001 = parsLib.convertFields(record.controlFields, ['001', '003'])
        should.exist(field001['001'])
        should.exist(field001['003'])
        field001['001'][0].should.equal('1234567890')
        field001['003'][0].should.equal('OCoLC')
      })
      .done(() => {
        done()
      })
  })

  it('It should build the items object', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')))
      .map((record) => {
        parsLib.registerLogger('test/test_tmp.mrc')
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.items = parsLib.buildItems(record)

        should.exist(record.itemXmlJsObj['*OKTN 82-3481'])
        record.itemXmlJsObj['*OKTN 82-3481'].length.should.equal(11)
      })
      .done(() => {
        done()
      })
  })

  it('It should build the items object multiple items one 866', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_callnumbers.mrc')))
      .map((record) => {
        parsLib.registerLogger('test/test_tmp.mrc')
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.items = parsLib.buildItems(record)

        should.exist(record.itemXmlJsObj['JFM 94-909'])
        should.exist(record.itemXmlJsObj['JLM 81-512'])
        should.exist(record.itemXmlJsObj['JLM 81-512'])
      })
      .done(() => {
        done()
      })
  })

  it('It should build the holdings 852 and 866 statements - single call numbers multiple 866', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_866_1.mrc')))
      .map((record) => {
        parsLib.registerLogger('test/test_tmp.mrc')
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.items = parsLib.buildItems(record)
        var r = parsLib.buildHoldings852and866andItems(record, 'JFM 04-120')
        r.holding.owningInstitutionHoldingsId.should.equal('.c10446230.c10618818.c10039703')
        r.holding.content.collection.record[0].datafield[0].subfield[0]._.should.equal('rc2ma')
        r.holding.content.collection.record[0].datafield[0].subfield[1]._.should.equal('rcmi2')
        r.holding.content.collection.record[0].datafield[0].subfield[2]._.should.equal('JFM 04-120')
        r.holding.content.collection.record[0].datafield[1].subfield[0]._.should.equal('Online access: covers fall 1994-, 1(1955)-48(2002)., 49(2003)-55(2009).')
      })
      .done(() => {
        done()
      })
  })

  it('It should build the holdings 852 and 866 statements - multiple call numbers has 866', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_callnumbers.mrc')))
      .map((record) => {
        parsLib.registerLogger('test/test_tmp.mrc')
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.items = parsLib.buildItems(record)
        var r = parsLib.buildHoldings852and866andItems(record, 'JFM 94-909')
        r.holding.owningInstitutionHoldingsId.should.equal('')
        r.holding.content.collection.record[0].datafield[0].subfield[0]._.should.equal('rc2ma')
        r.holding.content.collection.record[0].datafield[0].subfield[1]._.should.equal('JFM 94-909')
        r.holding.content.collection.record[0].datafield[1].subfield[0]._.should.equal('1995, 1997, 1998')
      })
      .done(() => {
        done()
      })
  })
  it('It should build the holdings 852 and 866 statements - multiple call numbers no 866', function (done) {
    H(new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_callnumbers_no_866.mrc')))
      .map((record) => {
        parsLib.registerLogger('test/test_tmp.mrc')
        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij)
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

        record.items = parsLib.buildItems(record)
        var r = parsLib.buildHoldings852and866andItems(record, 'JFM 70-1')
        r.holding.owningInstitutionHoldingsId.should.equal('')
        r.holding.content.collection.record[0].datafield[0].subfield[0]._.should.equal('rc2ma')
        r.holding.content.collection.record[0].datafield[0].subfield[1]._.should.equal('JFM 70-1')
        r.holding.content.collection.record[0].datafield[1].subfield[0]._.should.equal('v. 1, v. 2 (1789-1801), v. 3 (1801-1807), v. 4 (1807-1815), v. 5 (1815-1818), v. 6 (1818-1819), v. 7 (1819-1821), v. 8 (1821-1824), v. 9 (1824-1827), v. 10 (1827-1829)')
      })
      .done(() => {
        done()
      })
  })
  it('Use restriction generation - blank (criculates)', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 211, 212, 210, 214, 215, 227
    // $y = 55 or 57
    var data876 = {
      o: '2',
      s: '211',
      y: '55',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'GN')
    r.useRestriction.should.equal('')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Supervised Use', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 4, a, p, u
    // $s = 211, 212, 210, 214, 215, 227

    var data876 = {
      o: 4,
      s: '211',
      y: '55',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'ND')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Private')
  })

  it('Use restriction generation - In Library Use', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 211, 212, 210, 214, 215, 227
    // $y = 2, 3, 4, 5, 6, 7, 25, 26, 32, 33, 34, 35, 42, 43, 52, 53, 60, 61, 65, 67
    var data876 = {
      o: 2,
      s: '227',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'ND')
    r.useRestriction.should.equal('In Library Use')
    r.groupDesignation.should.equal('Private')
  })

  it('Use restriction generation - Supervised Use 2', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 213, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 228, 230

    var data876 = {
      o: 2,
      s: '226',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Catch all', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    var data876 = {
      o: 2,
      s: '68',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Catch all 2', function () {
    var data852 = { '3': false, b: 'rcma2', h: false }
    var data876 = { o: '2',
      s: '3333',
      y: '2',
      a: '.i100005184',
      j: '-',
      p: '33433014514305',
    t: '1' }

    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })

  it('Export all examples', function (done) {
    this.timeout(500000)

    var allTests = [
      new marc.Iso2709Reader(fs.createReadStream('test/test_a_lot_of_items.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_has_bib_call_number.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_has_bnumber.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_has_non_recap_items.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_has_oclc.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_866_1.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_866_2.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_callnumbers_no_866.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_callnumbers.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_multiple_items.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_no_001_has_991.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_no_001_no_991.mrc')),
      new marc.Iso2709Reader(fs.createReadStream('test/test_too_large_record.mrc'))
    ]

    // uhhhh
    var filenames = [
      'test/examples/test_a_lot_of_items.mrc',
      'test/examples/test_has_bib_call_number.mrc',
      'test/examples/test_has_bnumber.mrc',
      'test/examples/test_has_non_recap_items.mrc',
      'test/examples/test_has_oclc.mrc',
      'test/examples/test_multiple_866_1.mrc',
      'test/examples/test_multiple_866_2.mrc',
      'test/examples/test_multiple_callnumbers_no_866.mrc',
      'test/examples/test_multiple_callnumbers.mrc',
      'test/examples/test_multiple_items.mrc',
      'test/examples/test_no_001_has_991.mrc',
      'test/examples/test_no_001_no_991.mrc',
      'test/examples/test_too_large_record.mrc'

    ]
    var index = 0

    H(allTests)
      .map((aFile) => {
        H(aFile)
          .map((record) => {
            var filename = filenames[index++]
            parsLib.registerLogger(filename.replace('.mrc', ''))
            record = parsLib.convertToJsonCheckSize(record)
            record.bNumber = parsLib.extractBnumber(record.mij)
            record.oclcNumber = parsLib.extractOclc(record.mij)
            record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
            record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
            record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
            record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
            record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format
            record.items = parsLib.buildItems(record)
            record.recordObj = parsLib.buildRecord(record)
            const builder = new xml2js.Builder({headless: true})
            var xml = builder.buildObject(record.recordObj)

            xml = `<?xml version="1.0" ?>
<bibRecords>
${xml}
</bibRecords>
`

            fs.writeFileSync(filename.replace('.mrc', '.xml'), xml)
          })
          .done(() => {
          })
      })
      .done(() => {
        done()
      })
  })
})
