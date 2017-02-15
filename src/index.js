/* globals addEventListener firebase moment Vue */

import CachedPosts from './model/CachedPosts'
import PostCards from './partial/PostCards.vue'
import PostReceiver from './service/PostReceiver'
import NotifyService from './service/NotifyService'
import ShownPosts from './model/ShownPosts'

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
}

function firebaseLoaded () {
  firebase.initializeApp({
    apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
    databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
    messagingSenderId: '895779023522'
  })

  var database = firebase.database()
  var messaging = firebase.messaging()

  NotifyService.init(messaging, 'https://sns-taka3sh-org-157419.appspot.com/subscribe/')
  messaging.onTokenRefresh(function () {
    NotifyService.subscribe()
  })

  PostReceiver.init(database.ref('/posts'))
  return PostReceiver.loadAll()
}

function onNotifyToggle () {
  var self = this

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
  }
}

var app = new Vue({
  el: '#app',
  data: {
    posts: CachedPosts.getPosts(),
    postKeys: CachedPosts.getKeys(),
    ready: CachedPosts.isExist(),
    notify: NotifyService.isEnabled(),
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
