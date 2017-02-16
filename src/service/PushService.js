/* globals fetch FormData */

export default {
  init: function (auth, endpoint) {
    this.auth = auth
    this.endpoint = endpoint
  },

  publish: function (form) {
    var endpoint = this.endpoint
    return this.auth.currentUser.getToken(true)
    .then(function (idToken) {
      form.elements.idToken.value = idToken
      return fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        body: new FormData(form)
      })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to publish')
      })
    })
  }
}
