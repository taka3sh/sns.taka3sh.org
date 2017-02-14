/* globals addEventListener firebase moment Vue */

import CachedPosts from './CachedPosts'
import PostCards from './PostCards.vue'
import PostReceiver from './PostReceiver'
import PushService from './PushService'
import ShownPosts from './ShownPosts'

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

  addEventListener('load', function () {
    firebaseLoaded()
    .then(function (lastKey) {
      app.ready = true
      PostReceiver.listen()
    })
  })
}

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
    databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
    messagingSenderId: '895779023522'
  })

  var database = firebase.database()
  var messaging = firebase.messaging()

  PushService.init(messaging, 'sns-taka3sh-org-157419')
  messaging.onTokenRefresh(function () {
    PushService.subscribe()
  })

  PostReceiver.init(database.ref('/posts'))
  return PostReceiver.loadAll()
}

function onNotifyToggle () {
  var self = this

  if (self.notify) {
    PushService.unsubscribe()
    self.notify = false
  } else {
    PushService.subscribe()
    .then(function () {
      self.notify = true
    })
  }
}

export default new Vue({
  el: '#app',
  data: {
    posts: CachedPosts.getPosts(),
    postKeys: CachedPosts.getKeys(),
    busy: false,
    ready: false,
    error: null,
    notify: PushService.isEnabled()
  },
  methods: {
    onNotifyToggle: onNotifyToggle
  },
  created: vueCreated
})
