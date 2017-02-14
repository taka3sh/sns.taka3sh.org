/* globals addEventListener firebase moment Vue */

import AuthService from './service/AuthService'
import LoginForm from './partial/LoginForm.vue'
import StoredPost from './model/StoredPost'
import PushService from './service/PushService'

moment.locale('ja')

Vue.filter('date-localize', function (value) {
  return moment(value).format('LLLL')
})

Vue.component('login-form', LoginForm)

function showMessage (el, message) {
  el.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: message
  })
}

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

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
    databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
    messagingSenderId: '895779023522'
  })

  var auth = firebase.auth()
  var database = firebase.database()

  AuthService.init(auth)
  PushService.init(auth, 'sns-taka3sh-org-157419')
  StoredPost.init(database.ref('/posts'))
}

function onCreate (e) {
  var self = this

  self.busy = true
  StoredPost.create(this.title, this.body, this.createdAt)
  .then(function () {
    showMessage(self.$el, 'The new post was successfully created.')
    return PushService.publish(e.target)
  })
  .then(function () {
    self.busy = false
    e.target.reset()
    showMessage(self.$el, 'The new post was successfully published.')
  })
  .catch(function (err) {
    self.busy = false
    console.error(err)
    showMessage(self.$el, err.message)
  })
}

function onReset (e) {
  this.title = this.body = ''
  this.createdAt = moment().startOf('minute').toISOString()
  this.$nextTick(updateMDL)
}

function onLogin (email, password) {
  var el = this.$el

  AuthService.login(email, password)
  .catch(function (err) {
    console.error(err)
    showMessage(el, err.message)
  })
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

addEventListener('load', function () {
  firebaseLoaded()

  firebase.auth().onAuthStateChanged(function (user) {
    app.user = logindialog.user = user && user.email
  })
})

export default {
  app: app,
  logindialog: logindialog
}
