const fs = require('fs')
const path = require('path')

const ejs = require('ejs')
const rollup = require('rollup')

const alias = require('@rollup/plugin-alias')
const VuePlugin = require('rollup-plugin-vue')

const html = ['index', 'create']
const js = ['firebase-messaging-sw', 'index', 'create']

module.exports = {
  build: function () {
    const plugins = [VuePlugin()]

    if (process.env.CONTEXT === 'production') {
      plugins.push(alias({
        entries: [
          {
            find: '../common/constants/development',
            replacement: path.join(__dirname, '../src/common/constants/production')
          }
        ]
      }))
    }

    for (const name of html) {
      ejs.renderFile(`./src/common/${name}.html.ejs`, function (err, data) {
        if (err) throw err
        fs.writeFileSync(`./public/${name}.html`, data)
      })
    }

    for (const name of js) {
      rollup.rollup({
        input: `./src/${name}/${name}.js`,
        plugins: plugins
      })
        .then(bundle => {
          bundle.write({
            format: 'iife',
            file: `./public/${name}.js`,
            name: 'app'
          })
        })
        .catch(console.log)
    }
  }
}

module.exports.build()
