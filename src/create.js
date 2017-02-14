/* globals addEventListener firebase moment Vue */

import AuthService from './AuthService'
import LoginForm from './LoginForm.vue'

moment.locale('ja')

Vue.filter('date-localize', function (value) {
  return moment(value).format('LLLL')
})

Vue.component('login-form', LoginForm)

addEventListener('load', function () {
  firebase.initializeApp({
    apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
    databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
    messagingSenderId: '895779023522'
  })

  var auth = firebase.auth()

  AuthService.init(auth)

  auth.onAuthStateChanged(function (user) {
    app.user = logindialog.user = user && user.email
  })
})

var app = new Vue({
  el: '#app',
  data: {
    title: '',
    body: '',
    createdAt: '',
    user: null,
    busy: false
  },
  methods: {
    onLogout: function () {
      AuthService.logout()
    }
  }
})

var logindialog = new Vue({
  el: '#logindialog',
  template: '<login-form :user="user" @login="onLogin">',
  data: {
    user: null
  },
  methods: {
    onLogin: function (email, password) {
      AuthService.login(email, password)
    }
  }
})

export default {
  app: app,
  logindialog: logindialog
}
