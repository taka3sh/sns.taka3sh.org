export default {
  init: function (auth) {
    this.auth = auth
  },

  login: function (email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }
}
