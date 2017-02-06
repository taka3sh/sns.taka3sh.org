const fs = require('fs')

const build = require('./build')

build.build()
fs.watch(build.srcdir, function (eventType, filename) {
  console.log(filename)
  build.build()
})

const app = require('connect')()
app.use(require('compression')())
app.use(require('serve-static')(build.destdir))
const host = process.argv[2] || '127.0.0.1'
console.log(`Listening on https://${host}:8443`)
require('https').createServer({
  cert: fs.readFileSync('test/localhost.crt'),
  key: fs.readFileSync('test/localhost.key')
}, app).listen({
  host: host,
  port: 8443
})
