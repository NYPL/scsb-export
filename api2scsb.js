const wrapper = require('sierra-wrapper')
const _ = require('highland')
const glob = require('glob')
const fs = require('fs')
const parsLib = require('./lib/parseapi')
const parsLibMrc = require('./lib/parsemrc')
const xml2js = require('xml2js')
const builder = new xml2js.Builder({renderOpts: {pretty: false}, headless: true})

const loadedConfig = wrapper.loadConfig('./test/config.real.test.json')
if (!loadedConfig) {
  console.log('No config: config.real.test.json was not found, no credentials to use')
  process.exit()
}

parsLibMrc.registerLogger('data/large_records.mrc')
var output = fs.createWriteStream('data/large_records_converted.xml')
output.write('<?xml version="1.0" ?>\n<bibRecords>\n')
var completedBnumbers = []

var downloadData = function (bnumber, callback) {
  wrapper.auth((errorAuth, results) => {
    if (errorAuth) console.log(errorAuth)
    wrapper.requestSingleBib(bnumber, (errorBibReq, resultsBib) => {
      if (errorBibReq) console.log(errorBibReq)
      wrapper.requestBibItems(bnumber, (errorItemReq, resultsItem) => {
        if (errorItemReq) console.log(errorItemReq)
        callback(null, {bnumber: bnumber, bib: resultsBib.data.entries[0], items: resultsItem.data.entries})
      })
    })
  })
}
parsLibMrc.loadBarcodes('data/barcodefile.txt', () => {
  // load all the reprots from the data directory
  glob('data/recap*.mrc.log.txt', (er, files) => {
    if (er) throw er
    console.log(files)
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    _(files.map((file) => _(fs.createReadStream(file))))
      .merge()
      .split()
      .compact()
      .map((line) => {
        if (line.search('90Kb') === -1) return ''
        var bibId = line.split(',')[1].trim().replace('.b', '').substring(0, 8)
        if (completedBnumbers.indexOf(bibId) > -1) {
          console.log('Already did this bnumber:', bibId)
          return ''
        }

        completedBnumbers.push(bibId)
        return bibId
      })
      .compact()
      .map(_.curry(downloadData))
      .nfcall([])
      .parallel(2)
      .each((data) => {
        var bib = parsLib.modifyBib(data.bib)

        bib = parsLib.convertToMiJFormat(bib)
        var itemsMiJ = parsLib.convertItemsToMiJ(data.items)
        bib.fields = bib.fields.concat(itemsMiJ)
        var record = {mij: bib}
        record.bNumber = parsLibMrc.extractBnumber(record.mij) // 907|a
        record.oclcNumber = parsLibMrc.extractOclc(record.mij)
        record.bibCallNumber = parsLibMrc.extractBibCallNumber(record.mij)
        record.itemData = parsLibMrc.extractItemFields(record.mij) // 852 + 876
        record.holdingData = parsLibMrc.extractHoldingFields(record.mij) // 866 data
        record.controlFields = parsLibMrc.extractControlFields(record.mij) // control fields in mij format
        record.dataFields = parsLibMrc.extractDataFields(record) // data fields in mij format
        console.log(record.bNumber, '|', completedBnumbers.length)
        // build the new data structures
        record.items = parsLibMrc.buildItems(record)
        record.recordObj = parsLibMrc.buildRecord(record)

        if (record.itemCount === 0) {
          console.logToFile(`No items on this bib - skipping, ${record.bNumber}`)
          return ''
        }

        // if it passed those checks
        parsLibMrc.countBib++

        var xml = '  ' + builder.buildObject(record.recordObj) + '\n'
        output.write(xml)
      })
      .compact()
      .done(() => {
        output.end('</bibRecords>')
        var report = fs.createWriteStream('data/large_records_report.txt')
        report.end('Total Bibs:' + parsLibMrc.countBib + '\n' + 'Total Holdings:' + parsLibMrc.countHolding + '\n' + 'Total Items:' + parsLibMrc.countItem + '\n' + 'Total bibs with OCLC:' + parsLibMrc.countBibWithOclc + '\n' + JSON.stringify(parsLibMrc.useRestrictionGroupDesignation, null, 2))

        var useReport = fs.createWriteStream('data/large_records_use_report.txt')
        useReport.end(JSON.stringify(parsLibMrc.useRestrictionGroupDesignationCheck, null, 2))

        Object.keys(parsLibMrc.sampleReport).forEach((key) => {
          var sampleReportOut = fs.createWriteStream('data/large_records.txt'.replace('.txt', `_report_${key}.csv`))
          sampleReportOut.end(parsLibMrc.sampleReport[key].join('\n'))
        })
      })
  })
})
