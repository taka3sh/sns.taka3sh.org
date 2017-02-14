/* globals addEventListener firebase moment Vue */

import CachedPosts from './CachedPosts'
import PostReceiver from './PostReceiver'
import PushService from './PushService'
import PostCards from './PostCards.vue'

function initFirebase () {
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

Vue.filter('date-localize', function (value) {
  return moment(value).format('LLLL')
})

var data = {
  posts: [],
  postKeys: {},
  busy: false,
  loaded: true,
  error: null,
  notify: false
}

export default new Vue({
  el: '#app',
  data: data,
  watch: {},
  methods: {
    addPost: function (key, value) {
      if (!this.postKeys[key]) {
        this.posts.unshift(value)
        this.postKeys[key] = true
      }
    },
    onToggle: function () {
    }
  },
  components: {
    'post-cards': PostCards
  },
  created: function () {
    var app = this

    moment.locale('ja')

    app.posts = CachedPosts.getPosts()
    app.postKeys = CachedPosts.getKeys()

    PostReceiver.onChildAdded = function (key, val) {
      CachedPosts.add(key, val)
      app.addPost(key, val)
    }

    addEventListener('load', function () {
      initFirebase()
      .then(function (lastKey) {
        app.ready = true
        PostReceiver.listen()
      })
    })
  }
})
