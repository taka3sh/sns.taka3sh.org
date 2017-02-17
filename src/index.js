/* globals addEventListener firebase moment Vue */

import CachedPosts from './model/CachedPosts'
import ShownPosts from './model/ShownPosts'

import PostReceiver from './service/PostReceiver'
import NotifyService from './service/NotifyService'

import PostCards from './partial/PostCards.vue'

import {
  firebaseApiKey,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  notifyEndpoint,
  postPrefix
} from './Constants'

moment.locale('ja')

Vue.component('post-cards', PostCards)

Vue.filter('date-localize', function (value) {
  return moment(value).format('LLLL')
})

function vueCreated () {
  var app = this

  ShownPosts.init(app.postKeys, app.posts)

  PostReceiver.onChildAdded = function (key, val) {
    CachedPosts.add(key, val)
    ShownPosts.add(key, val)
  }

  if (NotifyService.isSupported()) {
    NotifyService.isEnabled().then(function (value) {
      app.notify = value
    })
  }
}

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: firebaseApiKey,
    databaseURL: firebaseDatabaseURL,
    messagingSenderId: firebaseMessagingSenderId
  })

  var database = firebase.database()
  var messaging = firebase.messaging()

  NotifyService.init(messaging, notifyEndpoint)
  messaging.onTokenRefresh(function () {
    NotifyService.subscribe()
  })
  messaging.onMessage(function (message) {
    NotifyService.installServiceWorker().then(function (swReg) {
      swReg.showNotification(message.notification.title, {
        icon: '/icon.png'
      })
    })
  })

  PostReceiver.init(database.ref(postPrefix))
  return PostReceiver.loadAll()
}

function onNotifyToggle () {
  var self = this

  if (!NotifyService.isSupported()) return

  if (self.notify) {
    NotifyService.unsubscribe()
    self.notify = false
  } else {
    self.busy = true
    NotifyService.subscribe()
    .then(function () {
      self.busy = false
      self.notify = true
    })
    .catch(function (err) {
      self.busy = false
      console.error(err)
    })
  }
}

var app = new Vue({
  el: '#app',
  data: {
    posts: CachedPosts.getPosts(),
    postKeys: CachedPosts.getKeys(),
    ready: CachedPosts.isExist(),
    notify: NotifyService.isTokenSent(),
    busy: false,
    error: null
  },
  methods: {
    onNotifyToggle: onNotifyToggle
  },
  created: vueCreated
})

addEventListener('load', function () {
  firebaseLoaded()
  .then(function () {
    app.ready = true
    PostReceiver.listen()
  })
})

export default app
