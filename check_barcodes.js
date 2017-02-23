const _ = require('highland')
const glob = require('glob')
const fs = require('fs')
const marc = require('marcjs')
const parsLibMrc = require('./lib/parsemrc')

var c = 0
var notFoundBarcodes = new Map()
var badBarcodes = new Map()

var totalBarcodesFound = 0
var totalBarcodesNotFound = 0

var readFile = _.wrapCallback(fs.readFile);


parsLibMrc.loadBarcodes('data/barcodefile.txt', () => {
  glob('data/recap*.mrc', (er, files) => {
    if (er) throw er
    // files = [files[0]]
    console.log(files)

    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    _(files.map((file) => _(new marc.Iso2709Reader(fs.createReadStream(file)))))
      .merge()
      .compact()
      .each((record) => {
        if (c++ % 1000 === 0) process.stdout.write(`Record Processed: ${c.toString()}` + '\r')

	    	record = record.toMiJ()
	    	record.fields.forEach((f) => {
	    		if (f['876']){
	    			if (f['876'].subfields){
	    				f['876'].subfields.forEach((sf) => {
	    					if (sf['p']){
	    						var barcode = sf['p']
					    		if (barcode){
					    			var parsedBarcode = parseInt(barcode)
					    			if (!isNaN(parsedBarcode)){
					    				if (parsLibMrc.barcodes.get(parsedBarcode)){
					    					parsLibMrc.barcodes.set(parsedBarcode,true)
					    				}else{
					    					notFoundBarcodes.set(barcode,false)
					    				}
					    			}else{
					    				badBarcodes.set(barcode,false)
					    			}

					    		}else{

					    		}
	    					}
	    				})
	    			}
	    		}
	    	})
      })
      .done(() => {

				_(['data/recap12_converted.xml']) // Creates a stream from an array of filenames
				  .map(readFile)
				  .series()
					.splitBy('<bibRecord>')
					.map((r) =>{
						if (r.search(/\?xml/) > -1) return ''// header
						r = r.replace(/<\/bibRecords>/,'')
						return `<bibRecord>${r}`
					})
					.compact()
					.map((xml) =>{
						var matches = xml.match(/<subfield code="p">[0-9]{14}<\/subfield>/g)
						matches.forEach((m) =>{
							m = parseInt(m.match(/[0-9]{14}/)[0])
	    				if (parsLibMrc.barcodes.get(m)){
	    					parsLibMrc.barcodes.set(m,true)
	    				}else{
	    					notFoundBarcodes.set(m,false)
	    				}
						})
					})
					.done(() =>{
		      	var totalBarcodesNotFoundAry = []
						parsLibMrc.barcodes.forEach(function(value, key) {
						  if (value === true){
						  	totalBarcodesFound++
						  }else{
						  	totalBarcodesNotFound++
						  	totalBarcodesNotFoundAry.push(key)
						  }
						})
						var totalBarcodesNotFoundFile = fs.createWriteStream('data/totalBarcodesNotFound.txt')
		        totalBarcodesNotFoundFile.end(totalBarcodesNotFoundAry.join('\n'))
						console.log("totalBarcodesFound", totalBarcodesFound, "totalBarcodesNotFound",totalBarcodesNotFound)
					})
      })
	})
})