/* globals localStorage */

export var CachedPosts = {
  keys: {},
  posts: [],

  add: function (key, post) {
    CachedPosts.keys[key] = true
    localStorage.setItem('postKeys', JSON.stringify(CachedPosts.keys))

    CachedPosts.posts.unshift(post)
    localStorage.setItem('posts', JSON.stringify(CachedPosts.posts))
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
