const fs = require('fs')

const ejs = require('ejs')
const rollup = require('rollup')

const alias = require('rollup-plugin-alias')
const vue = require('rollup-plugin-vue')

const html = ['index', 'create']
const js = ['firebase-messaging-sw', 'index', 'create']

exports.build = function () {
  let plugins = [vue()]

  if (process.env.CONTEXT === 'production') {
    plugins.unshift(alias({
      '../common/constants/development': '../common/constants/production'
    }))
  }

  for (let name of html) {
    ejs.renderFile(`./src/common/${name}.html.ejs`, function (err, data) {
      if (err) throw err
      fs.writeFileSync(`./public/${name}.html`, data)
    })
  }

  for (let name of js) {
    rollup.rollup({
      entry: `./src/${name}/${name}.js`,
      plugins: plugins
    })
    .then(bundle => {
      bundle.write({
        format: 'iife',
        dest: `./public/${name}.js`,
        moduleName: 'app'
      })
    })
    .catch(console.log)
  }
}

exports.build()
