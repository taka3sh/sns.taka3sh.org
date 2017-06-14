/* globals addEventListener firebase location Vue */

import NotifySwitch from './component/NotifySwitch.vue'
import PostCards from '../common/component/PostCards.vue'

import {
  firebaseApiKey,
  firebaseDatabaseURL,
  firebaseMessagingSenderId,
  notifyEndpoint,
  postPrefix
} from '../common/constants/development'

import CachedPosts from './model/CachedPosts'
import ShownPosts from './model/ShownPosts'

import PostReceiver from './service/PostReceiver'
import NotifyService from './service/NotifyService'

setTimeout(function () {
  var hash = location.hash

  if (hash) {
    location.hash = ''
    location.hash = hash
  }
}, 20)

function vueCreated () {
  var app = this

  CachedPosts.invalidateCache()

  ShownPosts.init(app.postKeys, app.posts)

  PostReceiver.onChildAdded = function (key, val) {
    CachedPosts.add(key, val)
    ShownPosts.add(key, val)
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

  if (NotifyService.isSupported()) {
    NotifyService.getEnabled().then(function (value) {
      app.notify = value

      if (value) {
        messaging.getToken()
      }
    })
  }

  var postsRef = database.ref(postPrefix)
  postsRef.on('child_removed', function () {
    CachedPosts.invalidateCache()
  })

  PostReceiver.init(postsRef)
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
    notify: NotifyService.isPreviouslyEnabled(),
    busy: false,
    error: null
  },
  methods: {
    onNotifyToggle: onNotifyToggle
  },
  created: vueCreated,
  components: {
    'post-cards': PostCards,
    'notify-switch': NotifySwitch
  }
})

addEventListener('load', function () {
  firebaseLoaded()
  .then(function () {
    app.ready = true
    PostReceiver.listen()
  })
})

export default app
