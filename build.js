const fs = require('fs')

const ejs = require('ejs')
const minify = require('html-minifier').minify
const UglifyJS = require('uglify-js')

function compile (filename) {
  return ejs.compile(String(fs.readFileSync(filename)), { filename: filename })
}

exports.srcdir = './public'
exports.destdir = './www'
exports.data = require(`./${this.srcdir}/_data.json`)
exports.layout = compile(`./${this.srcdir}/_layout.ejs`)

exports.render = function (source, template) {
  let context = Object.create(this.data[source])
  context.current = { source: source }
  context.yield = template(context)
  const rendered = this.layout(context)
  return minify(rendered, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: (text, inline) => UglifyJS.minify(text, {
      fromString: true,
      mangle: { toplevel: true },
      mangleProperties: { regex: /^_/ }
    }).code
  })
}

exports.build = function () {
  try {
    fs.mkdirSync(this.destdir)
  } catch (e) {}

  for (let basename of fs.readdirSync(this.srcdir)) {
    if (basename.startsWith('_')) continue

    const filename = `${this.srcdir}/${basename}`
    let contents
    if (basename.endsWith('.ejs')) {
      const source = basename.replace(/\.[^.]+$/, '')
      contents = this.render(source, compile(filename))
      basename = `${source}.html`
    } else {
      contents = fs.readFileSync(filename)
    }

    fs.writeFileSync(`${this.destdir}/${basename}`, contents)
  }
}

if (require.main === module) {
  exports.build()
}
