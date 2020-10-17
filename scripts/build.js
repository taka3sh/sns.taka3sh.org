const fs = require('fs')

const ejs = require('ejs')
const html = ['index', 'create']

module.exports = {
  build: function () {
    for (const name of html) {
      ejs.renderFile(`./src/common/${name}.html.ejs`, function (err, data) {
        if (err) throw err
        fs.writeFileSync(`./public/${name}.html`, data)
      })
    }
  }
}

module.exports.build()
