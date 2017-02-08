/* eslint-env browser */
/* global Vue, firebase, moment */

window.prerenderReady = false
var app = (function (JSON, localStorage) {
  var database, messaging

  var Post = {
    _keys: {},
    _posts: [],
    _add: function (key, post) {
      Post._keys[key] = true
      Post._posts.unshift(post)
    },
    _store: function () {
      localStorage.setItem('postKeys', JSON.stringify(Post._keys))
      localStorage.setItem('posts', JSON.stringify(Post._posts))
    },
    _fetchCachedPosts: function () {
      return JSON.parse(localStorage.getItem('posts')) || []
    },
    _fetchCachedKeys: function () {
      return JSON.parse(localStorage.getItem('postKeys')) || {}
    }
  }

  function sendTokenToServer (token) {
    return fetch('https://sns-taka3sh-org-157419.appspot.com/subscribe/' + token, { method: 'POST' })
    .then(function () {
      return token
    })
  }

  function requestPermission () {
    return messaging.requestPermission()
    .then(function () {
      return messaging.getToken()
    })
    .then(function (currentToken) {
      return currentToken
      ? sendTokenToServer(currentToken)
      : console.log('no permission')
    })
  }

  function deleteToken () {
    return messaging.getToken()
    .then(function (currentToken) {
      messaging.deleteToken(currentToken)
    })
  }

  Vue.filter('date-localize', function (value) {
    return moment(value).format('LLLL')
  })

  return new Vue({
    el: '#app',
    data: {
      posts: [],
      postKeys: {},
      busy: false,
      error: null,
      notify: JSON.parse(localStorage.getItem('notify'))
    },
    watch: {
      notify: function (value) {
        localStorage.setItem('notify', JSON.stringify(value))
      }
    },
    methods: {
      onToggle: function () {
        if (app.notify) {
          deleteToken()
          .catch(console.log)
          .then(function () {
            app.notify = false
          })
        } else {
          app.busy = true
          requestPermission()
          .then(function () {
            app.notify = true
          })
          .catch(console.log)
          .then(function () {
            app.busy = false
          })
        }
      }
    },
    created: function () {
      var app = this

      moment.locale(navigator.language)

      if (Notification.permission !== 'granted') {
        app.notify = false
      }

      app.posts = Post._fetchCachedPosts()
      app.postKeys = Post._fetchCachedKeys()

      addEventListener('load', function () {
        firebase.initializeApp({
          apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
          databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
          messagingSenderId: '895779023522'
        })
        database = firebase.database()
        messaging = firebase.messaging()

        database.ref('posts').once('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            Post._add(childSnapshot.key, childSnapshot.val())
            Post._store()

            if (!app.postKeys[childSnapshot.key]) {
              app.posts.unshift(childSnapshot.val())
              app.postKeys[childSnapshot.key] = true
            }
          })

          window.prerenderReady = true
        })

        messaging.onTokenRefresh(function () {
          messaging.getToken()
          .then(sendTokenToServer)
          .catch(function (e) {
            console.log(e)
          })
        })
      })
    }
  })
})(JSON, localStorage)
