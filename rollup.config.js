import vue from 'rollup-plugin-vue'

export default {
  entry: './src/index.js',
  format: 'iife',
  moduleName: 'app',
  dest: './www/index.js',
  plugins: [
    vue
  ]
}