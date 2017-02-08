const fs = require('fs')

const build = require('./build')

fs.watch(build.srcdir, {
  recursive: true
}, function (eventType, filename) {
  console.log(filename)
  build.build()
})
