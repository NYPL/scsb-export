const H = require('highland')
const fs = require('fs')
const parsLib = require('./lib/parse')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'marc', alias: 'm', type: String },
  { name: 'barcode', alias: 'b', type: String }
]

const options = commandLineArgs(optionDefinitions)

if (!options.marc || !options.barcode) {
  console.log('You need to supply the --marc filename and --barcode filename')
  console.log('For example: node index.js --marc "test/test_has_866.xml" --barcode "test/barcode.test.txt"')
  process.exit()
}

parsLib.loadBarcodes(options.barcode, () => {
  var output = fs.createWriteStream(options.marc.replace('.xml', '_converted.xml'))
  output.write('<?xml version="1.0" ?>\n<bibRecords>\n')
  var c = 0
  H(fs.createReadStream(options.marc))
    .splitBy('</marc:record>')
    .compact()
    .map((xmlBlob) => {
      // cut up to the marc record (ignoring headers) and add the string we splited on and make we are not at the end collection closing tag
      xmlBlob = xmlBlob.substring(xmlBlob.search('<marc:record>')).replace('</marc:collection>', '')
      xmlBlob = `${xmlBlob}</marc:record>`.trim()
      // last line
      if (xmlBlob === '</marc:record>') xmlBlob = ''
      return xmlBlob
    })
    .compact()
    .map(H.curry(parsLib.parse))
    .nfcall([])
    .parallel(100)
    .map((xmlJs) => {
      c++
      if (c % 100 === 0) process.stdout.write(c.toString() + '\r')
      var data = parsLib.extractData(xmlJs)
      if (data.xml === '') return ''
      // otherwise indent
      data.xml = `  ${data.xml.replace(/\n/g, '\n  ')}`
      return data.xml + '\n'
    })
    .compact()
    .pipe(output)

  output.on('finish', () => {
    process.stdout.write('\n\n')
    process.stdout.write(`Done processed ${c} records.`)
    fs.appendFile(options.marc.replace('.xml', '_converted.xml'), '</bibRecords>', function (err) {
      if (err) throw err
    })
  })
})
