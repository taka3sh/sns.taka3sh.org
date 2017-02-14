const fs = require('fs')

const build = require('./build')

fs.watch('./src', {
  recursive: true
}, function (eventType, filename) {
  console.log(filename)
  build.build()
})
