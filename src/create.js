/* globals addEventListener firebase moment Vue */

import LoginForm from './component/LoginForm.vue'

import {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  pushEndpoint,
  postPrefix
} from './constants/development'

import DateLocalize from './filter/DateLocalize'

import StoredPost from './model/StoredPost'

import PushService from './service/PushService'

import AuthService from './service/AuthService'

function showMessage (el, message) {
  el.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: message
  })
}

function vueMounted () {
  this.$el.querySelector('form').reset()
}

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDatabaseURL,
    messagingSenderId: firebaseMessagingSenderId
  })

  var auth = firebase.auth()
  var database = firebase.database()

  AuthService.init(auth)
  PushService.init(auth, pushEndpoint)
  StoredPost.init(database.ref(postPrefix))
}

function onCreate (e) {
  var self = this

  self.busy = true
  StoredPost.create(this.title, this.body, this.createdAt)
  .then(function (post) {
    showMessage(self.$el, 'The new post was successfully created.')
    e.target.elements.key.value = post.key
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
  this.createdAt = new Date().toISOString()
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
  mounted: vueMounted,
  filters: {
    'date-localize': DateLocalize
  }
})

var logindialog = new Vue({
  el: '#logindialog',
  template: '<login-form :user="user" @login="onLogin">',
  data: {
    user: AuthService.getUser()
  },
  methods: {
    onLogin: onLogin
  },
  components: {
    'login-form': LoginForm
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
