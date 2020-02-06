/* globals localStorage */

var CACHEDPOSTS_KEYS = 'CachedPosts:keys'
var CACHEDPOSTS_POSTS = 'CachedPosts:posts'

export default {
  keys: {},
  posts: [],

  isExist: function () {
    return this.getPosts().length > 0
  },

  getPosts: function () {
    var posts = JSON.parse(localStorage.getItem(CACHEDPOSTS_POSTS))
    return (posts instanceof Array && posts) || []
  },

  getKeys: function () {
    var keys = JSON.parse(localStorage.getItem(CACHEDPOSTS_KEYS))
    return (typeof keys === 'object' && keys) || {}
  },

  add: function (key, post) {
    this.keys[key] = true
    localStorage.setItem(CACHEDPOSTS_KEYS, JSON.stringify(this.keys))

    this.posts.unshift(post)
    localStorage.setItem(CACHEDPOSTS_POSTS, JSON.stringify(this.posts))
  },

  invalidateCache: function () {
    localStorage.removeItem(CACHEDPOSTS_KEYS)
    localStorage.removeItem(CACHEDPOSTS_POSTS)
  }
}
