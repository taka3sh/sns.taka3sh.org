const ngrok = require('ngrok')

const start = require('./start')

const port = 8000

start.start(port, function (err) {
  if (err) throw err
})

ngrok.connect({
  proto: 'http',
  addr: port,
  region: 'ap'
}, function (err, url) {
  if (err) throw err
  console.log(url)
})
