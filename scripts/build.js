import fs from 'fs'
import path from 'path'

import ejs from 'ejs'
import rollup from 'rollup'

import alias from '@rollup/plugin-alias'
import VuePlugin from 'rollup-plugin-vue'

const html = ['index', 'create']
const js = ['firebase-messaging-sw', 'index', 'create']

export function build() {
  const plugins = [VuePlugin()]

  if (process.env.CONTEXT === 'production') {
    plugins.unshift(alias({
      '../common/constants/development': path.join(__dirname, '../src/common/constants/production')
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

build()
