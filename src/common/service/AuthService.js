/* globals localStorage */

var AUTHSERVICE_USER = 'AuthService:user'

export default {
  init: function (auth) {
    this.auth = auth
  },

  getUser: function () {
    return localStorage.getItem(AUTHSERVICE_USER)
  },

  login: function (email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
    .then(function (user) {
      localStorage.setItem(AUTHSERVICE_USER, user.email)
    })
  },

  logout: function () {
    this.auth.signOut()
    .then(function () {
      localStorage.removeItem(AUTHSERVICE_USER)
    })
  }
}
