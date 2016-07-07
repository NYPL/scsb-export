/* global describe, it */

'use strict'
const assert = require('assert') // eslint-disable-line
const should = require('should') // eslint-disable-line
const parsLib = require('../lib/parseapi')
// const H = require('highland')
// const marc = require('marcjs')
// const fs = require('fs')
// const inspect = require('eyes').inspector({maxLength: false})
// const xml2js = require('xml2js')

var aBib = {'id': '11791027','updatedDate': '2015-12-30T16:06:12Z','createdDate': '2008-12-15T07:23:03Z','deleted': false,'suppressed': false,'lang': {'code': 'eng','name': 'English'},'title': 'JPRS.','author': '','materialType': {'code': 'a','value': 'BOOK/TEXT'},'bibLevel': {'code': 's','value': 'SERIAL'},'publishYear': 198,'catalogDate': '2001-01-03','country': {'code': 'dcu','name': 'District of Columbia'},'orders': [],'normTitle': 'jprs','normAuthor': '','locations': [{'code': 'slr','name': 'SIBL - Science Industry and Business'}],'fixedFields': {'24': {'label': 'Language','value': 'eng','display': 'English'},'25': {'label': 'Skip','value': '0'},'26': {'label': 'Location','value': 'slr  ','display': 'SIBL - Science Industry and Business'},'27': {'label': 'COPIES','value': '689'},'28': {'label': 'Cat. Date','value': '2001-01-03'},'29': {'label': 'Bib Level','value': 's','display': 'SERIAL'},'30': {'label': 'Material Type','value': 'a','display': 'BOOK/TEXT'},'31': {'label': 'Bib Code 3','value': '-'},'80': {'label': 'Record Type','value': 'b'},'81': {'label': 'Record Number','value': '11791027'},'83': {'label': 'Created Date','value': '2008-12-15T07:23:03Z'},'84': {'label': 'Updated Date','value': '2015-12-30T16:06:12Z'},'85': {'label': 'No. of Revisions','value': '9'},'86': {'label': 'Agency','value': '1'},'89': {'label': 'Country','value': 'dcu','display': 'District of Columbia'},'98': {'label': 'PDATE','value': '2015-12-17T15:02:43Z'},'107': {'label': 'MARC Type','value': ' '}},'varFields': [{'fieldTag': 'b','marcTag': '710','ind1': '1','ind2': ' ','subfields': [{'tag': 'a','content': 'United States.'}, {'tag': 'b','content': 'Joint Publications Research Service.'}]}, {'fieldTag': 'c','marcTag': '852','ind1': '8','ind2': ' ','subfields': [{'tag': 'h','content': 'TB (United States. Joint Publications Research Service. JPRS)'}, {'tag': 'z','content': 'Library has: No. 37 (1957)-no. 83079 (1983) (incomplete).'}, {'tag': 'z','content': 'Later vols. classed separately and traced.'}]}, {'fieldTag': 'd','marcTag': '650','ind1': ' ','ind2': '0','subfields': [{'tag': 'a','content': 'Research.'}]}, {'fieldTag': 'i','marcTag': '022','ind1': '0','ind2': ' ','subfields': [{'tag': 'a','content': '0093-6618'}]}, {'fieldTag': 'l','marcTag': '010','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': '58031492 //r873'}]}, {'fieldTag': 'l','marcTag': '035','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'RCON-EPA'}]}, {'fieldTag': 'l','marcTag': '035','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': '(WaOLN)nyp0015045'}]}, {'fieldTag': 'n','marcTag': '500','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'Imprint varies.'}]}, {'fieldTag': 'n','marcTag': '500','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'Published in various subseries: JPRS/NY report; JPRS/NY; JPRS/DC; etc.'}]}, {'fieldTag': 'n','marcTag': '515','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'Some v. not issued in numerical order.'}]}, {'fieldTag': 'n','marcTag': '580','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'Continued by various publications designated by letter-number combinations, such as JPRS-CAG-(no.), JPRS-NNT-(no.), etc.'}]}, {'fieldTag': 'o','marcTag': '001','ind1': ' ','ind2': ' ','content': 'NYPG93-S6046'}, {'fieldTag': 'p','marcTag': '260','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'Washington, D.C. :'}, {'tag': 'b','content': 'U.S. Dept. of Commerce, Office of Technical Services, Joint Publications Research Service :'}, {'tag': 'b','content': 'available from Supt. of Docs., G.P.O.,'}]}, {'fieldTag': 'q','marcTag': '852','ind1': '8','ind2': ' ','subfields': [{'tag': 'h','content': 'TB (United States. Joint Publications Research Service. JPRS)'}, {'tag': 'z','content': 'Library has: No. 37 (1957)-no. 83079 (1983) (incomplete).'}, {'tag': 'z','content': 'Later vols. classed separately and traced.'}]}, {'fieldTag': 'r','marcTag': '300','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'v. :'}, {'tag': 'b','content': 'ill. ;'}, {'tag': 'c','content': '26-34 cm.'}]}, {'fieldTag': 'r','marcTag': '362','ind1': '1','ind2': ' ','subfields': [{'tag': 'a','content': 'Ceased in 1983.'}]}, {'fieldTag': 't','marcTag': '245','ind1': '0','ind2': '0','subfields': [{'tag': 'a','content': 'JPRS.'}]}, {'fieldTag': 't','marcTag': '130','ind1': '0','ind2': ' ','subfields': [{'tag': 'a','content': 'JPRS (Series)'}]}, {'fieldTag': 'u','marcTag': '246','ind1': '3','ind2': '3','subfields': [{'tag': 'a','content': 'Joint Publications Research Service'}]}, {'fieldTag': 'u','marcTag': '299','ind1': '0','ind2': '0','subfields': [{'tag': 'a','content': 'JPRS.'}]}, {'fieldTag': 'v','marcTag': '959','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': '.b28452677'}, {'tag': 'b','content': '04-19-07'}, {'tag': 'c','content': '11-29-93'}]}, {'fieldTag': 'y','marcTag': '003','ind1': ' ','ind2': ' ','content': 'CStRLIN'}, {'fieldTag': 'y','marcTag': '005','ind1': ' ','ind2': ' ','content': '20000925124505.7'}, {'fieldTag': 'y','marcTag': '008','ind1': ' ','ind2': ' ','content': '931013d19uu1983dcuuu1m      f0   a0eng  cas a '}, {'fieldTag': 'y','marcTag': '040','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'DLC'}, {'tag': 'c','content': 'DI'}, {'tag': 'd','content': 'DI'}, {'tag': 'd','content': 'NSDP'}, {'tag': 'd','content': 'DLC'}, {'tag': 'd','content': 'm/c'}, {'tag': 'd','content': 'DLC'}, {'tag': 'd','content': 'CStRLIN'}, {'tag': 'd','content': 'NN'}, {'tag': 'd','content': 'WaOLN'}]}, {'fieldTag': 'y','marcTag': '042','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'nsdp'}, {'tag': 'a','content': 'lc'}]}, {'fieldTag': 'y','marcTag': '050','ind1': '0','ind2': '0','subfields': [{'tag': 'a','content': 'AS36'}, {'tag': 'b','content': '.U57'}]}, {'fieldTag': 'y','marcTag': '908','ind1': '0','ind2': '0','subfields': [{'tag': 'a','content': 'AS36'}, {'tag': 'b','content': '.U57'}]}, {'fieldTag': 'y','marcTag': '997','ind1': ' ','ind2': ' ','subfields': [{'tag': 'a','content': 'b'}, {'tag': 'b','content': '01-03-01'}, {'tag': 'c','content': 's'}, {'tag': 'd','content': 'a'}, {'tag': 'e','content': '-'}, {'tag': 'f','content': 'eng'}, {'tag': 'g','content': 'dcu'}, {'tag': 'h','content': '0'}]}, {'fieldTag': 'y','marcTag': '222','ind1': ' ','ind2': '0','subfields': [{'tag': 'a','content': 'JPRS. Joint Publications Research Service'}]}, {'fieldTag': '_','content': '00000cas  2200361 a 4500'}]} // eslint-disable-line

describe('parse API', function () {
  it('It should take the sierra API response and change some of the fields to match the export table output', function () {
    var r = parsLib.modifyBib(aBib)
    r.leader.should.equal('00000cas  2200361 a 4500')
    var has952 = false
    var has907 = false

    r.varFields.forEach((f) => {
      if (f.marcTag && f.marcTag === '952') has952 = true
      if (f.marcTag && f.marcTag === '907' && f.subfields[0].content === '.b117910272') has907 = true
    })
    has952.should.equal(true)
    has907.should.equal(true)
  })
  it('It should convert the sierra json format into the marc in json format', function () {
    var r = parsLib.modifyBib(aBib)
    r = parsLib.convertToMiJFormat(r)
    console.log(r)
  })
  it('Mod11 checkdigit', function () {
    parsLib.mod11(10018602).should.equal('100186026')
    parsLib.mod11(10004128).should.equal('100041280')
    parsLib.mod11(10024515).should.equal('100245158')
    parsLib.mod11(10018628).should.equal('100186282')
    parsLib.mod11('10319812').should.equal('10319812x')
    parsLib.mod11('i10940708').should.equal('i109407088')
    parsLib.mod11('.i11131021').should.equal('.i111310210')
    parsLib.mod11('.b11131021').should.equal('.b111310210')
    parsLib.mod11('.c11131021').should.equal('.c111310210')
  })
})
