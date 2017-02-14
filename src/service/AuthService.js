/* globals localStorage */

export default {
  init: function (auth) {
    this.auth = auth
  },

  getUser: function () {
    return localStorage.getItem('AuthService.user')
  },

  login: function (email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
    .then(function (user) {
      localStorage.setItem('AuthService.user', user.email)
    })
  },

  logout: function () {
    this.auth.signOut()
    .then(function () {
      localStorage.removeItem('AuthService.user')
    })
  }
}
