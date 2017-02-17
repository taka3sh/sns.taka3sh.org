const fs = require('fs')

const ejs = require('ejs')
const rollup = require('rollup')

const alias = require('rollup-plugin-alias')
const vue = require('rollup-plugin-vue')

const all = ['index', 'create']

exports.build = function () {
  let plugins = [vue()]

  if (process.env.CONTEXT === 'production') {
    plugins.unshift(alias({
      './constants/development': './constants/production'
    }))
  }

  for (let name of all) {
    rollup.rollup({
      entry: `./src/${name}.js`,
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

    ejs.renderFile(`./src/${name}.html.ejs`, function (err, data) {
      if (err) throw err
      fs.writeFileSync(`./public/${name}.html`, data)
    })
  }
}

exports.build()
