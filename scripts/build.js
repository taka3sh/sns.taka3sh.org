const fs = require('fs')
const path = require('path')

const ejs = require('ejs')

exports.srcdir = path.join(__dirname, '../public')
exports.destdir = path.join(__dirname, '../www')
exports.data = require(path.join(exports.srcdir, '_data.json'))

exports.build = function () {
  try {
    fs.mkdirSync(this.destdir)
  } catch (e) {}

  for (let basename of fs.readdirSync(this.srcdir)) {
    if (basename.startsWith('_')) continue

    const filename = path.join(this.srcdir, basename)
    let contents
    if (basename.endsWith('.ejs')) {
      const source = basename.replace(/\.[^.]+$/, '')
      let context = Object.create(this.data[source])
      contents = ejs.compile(String(fs.readFileSync(filename)), { filename: filename })(context)
      basename = `${source}.html`
    } else {
      contents = fs.readFileSync(filename)
    }

    fs.writeFileSync(path.join(this.destdir, basename), contents)
  }
}

exports.build()
