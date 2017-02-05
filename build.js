const Metalsmith = require('metalsmith')

const htmlMinifier = require('metalsmith-html-minifier')
const inPlace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')

const UglifyJS = require('uglify-js')

Metalsmith(__dirname)
.clean(false)
.use(inPlace())
.use(layouts({
  engine: 'ejs'
}))
.use(htmlMinifier({
  minifyCSS: true,
  minifyJS: function (text, inline) {
    return UglifyJS.minify(text, {
      fromString: true,
      mangle: {
        toplevel: true
      },
      mangleProperties: {
        regex: /^_/
      }
    }).code
  }
}))
.build(function (err) {
  if (err) throw err
})
