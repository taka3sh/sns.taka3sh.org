/* globals fetch FormData XMLHttpRequest */

export default {
  init: function (auth, projectid) {
    this.auth = auth
    this.projectid = projectid
  },

  publish: function (form) {
    var url = 'https://' + this.projectid + '.appspot.com/publish'
    return this.auth.currentUser.getToken(true)
    .then(function (idToken) {
      form.elements.idToken.value = idToken
      return fetch(url, {
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
