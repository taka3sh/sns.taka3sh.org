/* globals moment */

export default {
  init: function (ref) {
    this.ref = ref
  },

  create: function (title, body, createdAt) {
    return this.ref.push({
      title: title,
      body: body,
      createdAt: moment(createdAt).toISOString()
    })
  }
}
