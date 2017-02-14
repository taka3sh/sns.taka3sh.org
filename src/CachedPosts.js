/* globals localStorage */

export default {
  keys: {},
  posts: [],

  add: function (key, post) {
    this.keys[key] = true
    localStorage.setItem('postKeys', JSON.stringify(this.keys))

    this.posts.unshift(post)
    localStorage.setItem('posts', JSON.stringify(this.posts))
  },

  getPosts: function () {
    try {
      return JSON.parse(localStorage.getItem('posts')) || []
    } catch (err) {
      console.log(err)
    }
  },

  getKeys: function () {
    try {
      return JSON.parse(localStorage.getItem('postKeys')) || {}
    } catch (err) {
      console.log(err)
    }
  }
}
