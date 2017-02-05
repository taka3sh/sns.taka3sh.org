const Metalsmith = require('metalsmith')

const htmlMinifier = require('metalsmith-html-minifier')
const inPlace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')

const transform = require('babel-core').transform

Metalsmith(__dirname)
.clean(false)
.use(inPlace())
.use(layouts({ engine: 'ejs' }))
.use(htmlMinifier({
  minifyCSS: true,
  minifyJS: function (text, inline) {
    return transform(text, { presets: 'babili' }).code
  }
}))
.build(function (err) { if (err) throw err })
