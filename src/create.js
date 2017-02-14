/* globals addEventListener firebase moment Vue */

import AuthService from './AuthService'
import LoginForm from './LoginForm.vue'
import StoredPost from './post/StoredPost'

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
  var database = firebase.database()

  AuthService.init(auth)

  auth.onAuthStateChanged(function (user) {
    app.user = logindialog.user = user && user.email
  })

  StoredPost.init(database.ref('/posts-stage'))
})

function updateMDL () {
  this.$el.querySelectorAll('.mdl-js-textfield').forEach(function (elem) {
    if (elem.MaterialTextfield) {
      elem.MaterialTextfield.checkDirty()
    }
  })
}

function vueMounted () {
  this.$el.querySelector('form').reset()
}

function onCreate (e) {
  var self = this

  self.busy = true
  StoredPost.create(this.title, this.body, this.createdAt)
  .then(function () {
    self.busy = false
    e.target.reset()
  })
}

function onReset (e) {
  this.title = this.body = ''
  this.createdAt = moment().startOf('minute').toISOString()
  this.$nextTick(updateMDL)
}

function onLogin (email, password) {
  AuthService.login(email, password)
}

function onLogout () {
  AuthService.logout()
}

var app = new Vue({
  el: '#app',
  data: {
    title: '',
    body: '',
    createdAt: '',
    user: AuthService.getUser(),
    busy: false
  },
  methods: {
    onCreate: onCreate,
    onLogout: onLogout,
    onReset: onReset
  },
  mounted: vueMounted
})

var logindialog = new Vue({
  el: '#logindialog',
  template: '<login-form :user="user" @login="onLogin">',
  data: {
    user: AuthService.getUser()
  },
  methods: {
    onLogin: onLogin
  }
})

export default {
  app: app,
  logindialog: logindialog
}
