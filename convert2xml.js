const marc = require('marcjs')
const fs   = require('fs')
const _ = require('highland')


var counter = 0

if (!process.argv[2]){
  console.log('No file supplied.')
  process.exit()
}


var outfile = fs.createWriteStream(process.argv[2].replace('.mrc', '.xml'))

var write = function(record,callback){
  var xml = marc.MarcxmlWriter.format(record)
  process.stdout.write(++counter + '\r')
  outfile.write(xml + '\n')
  callback(null,record)
  // outfile.write(xml + '\n', function() {
  //   // Now the data has been written.
  //   console.log('here')
  //   callback(null,record)
  // })
}

_(new marc.Iso2709Reader(fs.createReadStream(process.argv[2])))

  .compact()
  .map(_.curry(write))
  .nfcall([])
  .series()
  .done(()=>{
    console.log(counter)
    console.log('done')
    outfile.end()
  })
