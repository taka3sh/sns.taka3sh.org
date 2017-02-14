const fs = require('fs')

const ejs = require('ejs')
const rollup = require('rollup')
const vue = require('rollup-plugin-vue')

const all = ['index', 'create']

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
      dest: `./public/${name}.js`,
      moduleName: 'app'
    })
  })
  .catch(console.log)

  ejs.renderFile(`./src/${name}.ejs`, function (err, data) {
    if (err) throw err
    fs.writeFileSync(`./public/${name}.html`, data)
  })
}
