const fs = require('fs')

const build = require('./build')

build.build()

var app = require('connect')()
app.use(require('compression')())
app.use(require('serve-static')('www'))
require('https').createServer({
  cert: fs.readFileSync('test/localhost.crt'),
  key: fs.readFileSync('test/localhost.key')
}, app).listen(8443)
