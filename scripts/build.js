import { writeFileSync } from 'fs'

import ejs from 'ejs'
import rollup from 'rollup'

import alias from '@rollup/plugin-alias'
import VuePlugin from 'rollup-plugin-vue'

const html = ['index', 'create']
const js = ['firebase-messaging-sw', 'index', 'create']

const plugins = process.env.CONTEXT === 'production'
  ? [VuePlugin()]
  : [
    VuePlugin(),
    alias({ '../common/constants/development': '../src/common/constants/production' })
  ]

export async function build () {
  for (const name of html) {
    ejs.renderFile(`./src/common/${name}.html.ejs`, function (err, data) {
      if (err) throw err
      writeFileSync(`./public/${name}.html`, data)
    })
  }

  for (const name of js) {
    const bundle = await rollup.rollup({
      input: `./src/${name}/${name}.js`,
      plugins: plugins
    })
    bundle.write({
      format: 'iife',
      file: `./public/${name}.js`,
      name: 'app'
    })
  }
}

build()
