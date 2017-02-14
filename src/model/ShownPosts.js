export default {
  init: function (keys, values) {
    this.keys = keys
    this.values = values
  },

  add: function (key, value) {
    if (!this.keys[key]) {
      this.keys[key] = true
      this.values.unshift(value)
    }
  }
}
