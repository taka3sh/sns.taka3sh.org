const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    index: './src/index/index.js',
    create: './src/create/create.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/public')
  },
  resolve: {
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

if (process.env.CONTEXT === 'production') {
  module.exports.resolve.alias['../common/constants/development'] = '../common/constants/production'
}
