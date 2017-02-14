/* globals localStorage */

export default {
  keys: {},
  posts: [],

  add: function (key, post) {
    this.keys[key] = true
    localStorage.setItem('CachedPosts.keys', JSON.stringify(this.keys))

    this.posts.unshift(post)
    localStorage.setItem('CachedPosts.posts', JSON.stringify(this.posts))
  },

  getPosts: function () {
    try {
      return JSON.parse(localStorage.getItem('CachedPosts.posts')) || []
    } catch (err) {
      console.log(err)
    }
  },

  getKeys: function () {
    try {
      return JSON.parse(localStorage.getItem('CachedPosts.keys')) || {}
    } catch (err) {
      console.log(err)
    }
  }
}
