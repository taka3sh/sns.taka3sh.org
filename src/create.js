/* globals addEventListener firebase moment Materialize Vue */

import StoredPost from './model/StoredPost'
import PushService from './service/PushService'
import AuthService from './service/AuthService'

import LoginForm from './component/LoginForm.vue'
import PostCards from './component/PostCards.vue'
import PostFormCard from './component/PostFormCard.vue'
import DateLocalize from './filter/DateLocalize'

import {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  pushEndpoint,
  postPrefix
} from './constants/development'

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
    Materialize.toast('The new post was successfully created.')
    return PushService.publish(post.key, self)
  })
  .then(function () {
    self.busy = false
    e.target.reset()
    Materialize.toast('The new post was successfully published.')
  })
  .catch(function (err) {
    self.busy = false
    console.error(err)
    Materialize.toast(err.message)
  })
}

function onReset (e) {
  this.post.title = this.post.body = ''
  this.post.createdAt = moment().format('YYYY-MM-DDThh:mm')
}

function onLogin (email, password) {
  AuthService.login(email, password)
  .catch(function (err) {
    console.error(err)
    Materialize.toast(err.message)
  })
}

function onLogout () {
  AuthService.logout()
}

moment.locale('ja')

var app = new Vue({
  el: '#app',
  data: {
    user: AuthService.getUser(),
    busy: false,
    post: {
      title: '',
      body: '',
      createdAt: ''
    }
  },
  methods: {
    onCreate: onCreate,
    onLogin: onLogin,
    onLogout: onLogout,
    onReset: onReset
  },
  mounted: vueMounted,
  components: {
    'login-form': LoginForm,
    'post-cards': PostCards,
    'post-form-card': PostFormCard
  },
  filters: {
    'date-localize': DateLocalize
  }
})

addEventListener('load', function () {
  firebaseLoaded()

  firebase.auth().onAuthStateChanged(function (user) {
    app.user = user && user.email
  })
})

export default app
