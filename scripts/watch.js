import { watch } from 'fs'

import { build } from './build.js'

watch('./src', {
  recursive: true
}, function (eventType, filename) {
  console.log(filename)
  build()
})
