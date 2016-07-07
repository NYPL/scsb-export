var wrapper = require('sierra-wrapper')

var loadedConfig = wrapper.loadConfig('./test/config.real.test.json')
if (!loadedConfig) {
  console.log('No config: config.real.test.json was not found, no credentials to use')
}

// wrapper.auth((error, results) => {
//   wrapper.requestSingleBib('11791027', (errorBibReq, results) => {
//     console.log(JSON.stringify(results.data.entries))
//   })
// })
