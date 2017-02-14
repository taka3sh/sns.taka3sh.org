const fs = require('fs')

const ejs = require('ejs')
const rollup = require('rollup')
const vue = require('rollup-plugin-vue')

const all = ['index']

for (let name of all) {
  rollup.rollup({
    entry: `./src/${name}.js`,
    plugins: [
      vue()
    ]
  })
  .then(bundle => {
    bundle.write({
      format: 'iife',
      dest: `./www/${name}.js`,
      moduleName: 'app'
    })
  })

  ejs.renderFile(`./public/${name}.ejs`, function (err, data) {
    if (err) throw err
    fs.writeFileSync(`./www/${name}.html`, data)
  })
}
