/* globals addEventListener firebase moment Vue */

import { CachedPosts } from './CachedPosts'
import { PushService } from './PushService'

function onFirebaseLoaded () {
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

  return database.ref('/posts').once('value', function (snapshot) {
    snapshot.forEach(function (child) {
      CachedPosts.add(child.key, child.val())
    })
  })
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
    onToggle: function () {
    }
  },
  created: function () {
    var app = this

    app.posts = CachedPosts.getPosts()
    app.postKeys = CachedPosts.getKeys()

    moment.locale('ja')

    addEventListener('load', function () {
      onFirebaseLoaded()
    })
  }
})
