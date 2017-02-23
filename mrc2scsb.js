const marc = require('marcjs')
const fs = require('fs')
const H = require('highland')
const parsLib = require('./lib/parsemrc')
const xml2js = require('xml2js')
const builder = new xml2js.Builder({renderOpts: {pretty: false}, headless: true})
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'marc', alias: 'm', type: String },
  { name: 'barcode', alias: 'b', type: String },
  { name: 'dupecheck', alias: 'd', type: String },
  { name: 'start', alias: 's', type: Number },
  { name: 'stop', alias: 'p', type: Number }
]

const options = commandLineArgs(optionDefinitions)
if (!options.marc || !options.barcode || !options.dupecheck) {
  console.log('You need to supply the --marc filename and --barcode filename')
  console.log('For example: node index.js --marc "test/test_has_866.xml" --barcode "test/barcode.test.txt" --dupecheck "test/dupecheck.txt"')
  process.exit()
}

// this is our logger
parsLib.registerLogger(options.marc)

var c = 0 // counter
// var cc = 0 // counter
// these are used to controle outputing only a subset of the data
var start = (options.start) ? options.start : 1
var stop = (options.stop) ? options.stop : 9999999999999

// output
var output = fs.createWriteStream(options.marc.replace('.mrc', '_converted.xml'))
output.write('<?xml version="1.0" ?>\n<bibRecords>\n')
parsLib.loadDupeCheck(options.dupecheck, () => {
  parsLib.loadBarcodes(options.barcode, () => {
    // read/parse the MARC file
    H(new marc.Iso2709Reader(fs.createReadStream(options.marc)))
      .map((record) => {
        if (c++ % 1000 === 0) process.stdout.write(`Record Processed: ${c.toString()}` + '\r')

        // just skip it if it is not in our start stop ranges
        if (c < start || c > stop) {
          return ''
        }

        record = parsLib.convertToJsonCheckSize(record)
        record.bNumber = parsLib.extractBnumber(record.mij) // 907|a

        // // if you want to write out a file for testing
        // if (record.bNumber === '.b113417287') {
        //   var w = new marc.MarcxmlWriter(fs.createWriteStream('data/example_SASB2_b113417287_' + ++cc + '.xml'))
        //   w.write(record.recordOrginal)
        // // var w = new marc.Iso2709Writer(fs.createWriteStream('test/denise_1.mrc'))
        // // w.write(record.recordOrginal)
        // }
        // return ''

        // drop the duplicate bnumbers we already did
        if (parsLib.dupeCheck.get(parseInt(record.bNumber.replace('.b', '')))) {
          // console.logToFile(`Duplicate - skipping, ${record.bNumber}`)
          return ''
        }
        parsLib.dupeCheck.set(parseInt(record.bNumber.replace('.b', '')), true)

        // drop the possible too large records
        if (record.recordSize > 90000) {
          console.logToFile(`MARC Record larger than 90Kb - skipping, ${record.bNumber}`)
          return ''
        }

        // pull out all the data we are going to need
        record.oclcNumber = parsLib.extractOclc(record.mij)
        record.bibCallNumber = parsLib.extractBibCallNumber(record.mij)
        record.itemData = parsLib.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLib.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLib.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLib.extractDataFields(record) // data fields in mij format

        // build the new data structures
        record.items = parsLib.buildItems(record)
        record.recordObj = parsLib.buildRecord(record)

        if (record.itemCount === 0) {
          console.logToFile(`No items on this bib - skipping, ${record.bNumber}`)
          return ''
        }

        // if it passed those checks
        parsLib.countBib++

        return record
      })
      .compact()
      .map((record) => {
        var xml = '  ' + builder.buildObject(record.recordObj) + '\n'
        output.write(xml)
        return xml
      })
      .done(() => {
        output.end('</bibRecords>')
        var report = fs.createWriteStream(options.marc.replace('.mrc', '_report.txt'))
        report.end('Total Bibs:' + parsLib.countBib + '\n' + 'Total Holdings:' + parsLib.countHolding + '\n' + 'Total Items:' + parsLib.countItem + '\n' + 'Total bibs with OCLC:' + parsLib.countBibWithOclc + '\n' + JSON.stringify(parsLib.useRestrictionGroupDesignation, null, 2))

        var useReport = fs.createWriteStream(options.marc.replace('.mrc', '_use_report.txt'))
        useReport.end(JSON.stringify(parsLib.useRestrictionGroupDesignationCheck, null, 2))

        Object.keys(parsLib.sampleReport).forEach((key) => {
          var sampleReportOut = fs.createWriteStream(options.marc.replace('.mrc', `_report_${key}.csv`))
          sampleReportOut.end(parsLib.sampleReport[key].join('\n'))
        })

        var finishedBibs = []
        for (var dupeCheckItem of parsLib.dupeCheck) {
          finishedBibs.push(dupeCheckItem[0])
        }
        var dupeCheckFile = fs.createWriteStream(options.dupecheck)
        H(finishedBibs)
          .map((key) => {
            return key.toString() + '\n'
          })
          .pipe(dupeCheckFile)
      })
  })
})
