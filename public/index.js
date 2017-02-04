/* eslint-env browser */
/* global Vue, firebase, moment */

var config = {
  apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
  databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
  messagingSenderId: '895779023522'
}
var database, messaging

function sendTokenToServer (token) {
  var endpoint = 'https://sns-taka3sh-org-157419.appspot.com/subscribe/' + token
  return fetch(endpoint, { method: 'POST' }).then(function () { return token })
}

function requestPermission () {
  return messaging.requestPermission()
  .then(function () {
    return messaging.getToken()
  })
  .then(function (currentToken) {
    if (currentToken) {
      return sendTokenToServer(currentToken)
    } else {
      console.log('no permission')
      return null
    }
  })
}

function deleteToken () {
  return messaging.getToken()
  .then(function (currentToken) {
    return messaging.deleteToken(currentToken)
  })
}

var Post = {
  _keys: {},
  _posts: [],
  add: function (key, post) {
    this._keys[key] = true
    this._posts.unshift(post)
  },
  store: function () {
    localStorage.setItem('postKeys', JSON.stringify(this._keys))
    localStorage.setItem('posts', JSON.stringify(this._posts))
  },
  fetchCachedPosts: function () {
    var posts = JSON.parse(localStorage.getItem('posts'))
    if (!(posts instanceof Array)) return []
    return posts
  },
  fetchCachedKeys: function () {
    var posts = JSON.parse(localStorage.getItem('postKeys'))
    if (!posts) return {}
    return posts
  }
}

moment.locale(navigator.language)

var app = new Vue({
  el: '#app',
  data: {
    posts: [],
    postKeys: {},
    requesting: false,
    error: null,
    notifyEnabled: JSON.parse(localStorage.getItem('notifyEnabled'))
  },
  watch: {
    notifyEnabled: function (value) {
      localStorage.setItem('notifyEnabled', JSON.stringify(value))
    }
  },
  methods: {
    localizeDate: function (date) {
      return moment(date).format('LLLL')
    },
    onToggleNotification: function () {
      var self = this
      if (self.notifyEnabled) {
        deleteToken()
        .catch(console.log)
        .then(function () {
          self.notifyEnabled = false
        })
      } else {
        self.requesting = true
        requestPermission()
        .then(function () {
          self.notifyEnabled = true
        })
        .catch(console.log)
        .then(function () {
          self.requesting = false
        })
      }
    }
  },
  created: function () {
    if (Notification.permission !== 'granted') {
      this.notifyEnabled = false
    }

    this.posts = Post.fetchCachedPosts()
    this.postKeys = Post.fetchCachedKeys()
  }
})

addEventListener('load', function () {
  firebase.initializeApp(config)
  database = firebase.database()
  messaging = firebase.messaging()

  database.ref('posts').limitToLast(1).once('value', function (snapshot) {
    if (snapshot.val() === null) {
      app.posts = []
      Post.store()
    }
  })

  database.ref('posts').on('child_added', function (snapshot) {
    Post.add(snapshot.key, snapshot.val())
    Post.store()

    if (!app.postKeys[snapshot.key]) {
      app.posts.unshift(snapshot.val())
      app.postKeys[snapshot.key] = true
    }
  })

  messaging.onTokenRefresh(function () {
    messaging.getToken()
    .then(sendTokenToServer)
    .catch(function (e) {
      console.log(e)
    })
  })
})
