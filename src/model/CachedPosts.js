/* globals localStorage */

export default {
  keys: {},
  posts: [],

  isExist: function () {
    return this.getPosts() !== null
  },

  getPosts: function () {
    var posts = JSON.parse(localStorage.getItem('CachedPosts.posts'))
    return posts instanceof Array && posts || []
  },

  getKeys: function () {
    var keys = JSON.parse(localStorage.getItem('CachedPosts.keys'))
    return keys && {}
  },

  add: function (key, post) {
    this.keys[key] = true
    localStorage.setItem('CachedPosts.keys', JSON.stringify(this.keys))

    this.posts.unshift(post)
    localStorage.setItem('CachedPosts.posts', JSON.stringify(this.posts))
  }
}
