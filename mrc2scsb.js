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
  { name: 'start', alias: 's', type: Number },
  { name: 'stop', alias: 'p', type: Number }
]

const options = commandLineArgs(optionDefinitions)
if (!options.marc || !options.barcode) {
  console.log('You need to supply the --marc filename and --barcode filename')
  console.log('For example: node index.js --marc "test/test_has_866.xml" --barcode "test/barcode.test.txt"')
  process.exit()
}

// this is our logger
parsLib.registerLogger(options.marc)

var c = 0 // counter
// these are used to controle outputing only a subset of the data
var start = (options.start) ? options.start : 1
var stop = (options.stop) ? options.stop : 9999999999999

// output
var output = fs.createWriteStream(options.marc.replace('.mrc', '_converted.xml'))
output.write('<?xml version="1.0" ?>\n<bibRecords>\n')

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
      record.dataFields = parsLib.extractDataFields(record.mij) // data fields in mij format

      // build the new data structures
      record.items = parsLib.buildItems(record)
      record.recordObj = parsLib.buildRecord(record)

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
      report.end('Total Bibs:' + parsLib.countBib + '\n' + 'Total Holdings:' + parsLib.countHolding + '\n' + 'Total Items:' + parsLib.countItem + '\n' + JSON.stringify(parsLib.useRestrictionGroupDesignation, null, 2))
    })
})
