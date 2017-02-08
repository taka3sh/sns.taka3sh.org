const fs = require('fs')
const http = require('http')

const compression = require('compression')
const connect = require('connect')
const serveStatic = require('serve-static')

const build = require('./build')

const app = connect()
app.use(compression())
app.use(serveStatic(build.destdir))

exports.start = (port, listener) => {
  console.log(build.srcdir)
  fs.watch(build.srcdir, {
    recursive: true
  }, function (eventType, filename) {
    console.log(filename)
    build.build()
  })

  build.build()
  return http.createServer(app).listen(port, listener)
}

if (require.main === module) {
  exports.start(8000, function (err) {
    if (err) throw err
    console.log(`http://localhost:${this.address().port}`)
  })
}
