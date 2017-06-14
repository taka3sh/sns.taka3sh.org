/* globals fetch FormData */

export default {
  init: function (auth, endpoint) {
    this.auth = auth
    this.endpoint = endpoint
  },

  publish: function (key, post) {
    var endpoint = this.endpoint

    var data = new FormData()
    data.append('key', key)
    data.append('title', post.title)
    data.append('body', post.body)
    data.append('createdAt', new Date(post.createdAt).toISOString())

    return this.auth.currentUser.getToken(true)
    .then(function (idToken) {
      data.append('idToken', idToken)

      return fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        body: data
      })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to publish')
      })
    })
  }
}
