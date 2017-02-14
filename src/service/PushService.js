/* globals FormData XMLHttpRequest */

export default {
  init: function (auth, projectid) {
    this.auth = auth
    this.projectid = projectid
  },

  publish: function (form) {
    return this.auth.currentUser.getToken(true)
    .then(function (idToken) {
      form.elements.idToken.value = idToken
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.onload = resolve
        xhr.onerror = reject
        xhr.open('POST', 'https://sns-taka3sh-org-157419.appspot.com/publish')
        xhr.send(new FormData(form))
      })
    })
  }
}
