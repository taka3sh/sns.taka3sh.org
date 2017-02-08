/* eslint-env browser */
/* global Vue, firebase, moment */

var app = ((JSON, localStorage) => {
  var database, messaging

  var Post = {
    _keys: {},
    _posts: [],
    _add: (key, post) => {
      Post._keys[key] = true
      Post._posts.unshift(post)
    },
    _store: () => {
      localStorage.setItem('postKeys', JSON.stringify(Post._keys))
      localStorage.setItem('posts', JSON.stringify(Post._posts))
    },
    _fetchCachedPosts: () => JSON.parse(localStorage.getItem('posts')) || [],
    _fetchCachedKeys: () => JSON.parse(localStorage.getItem('postKeys')) || {}
  }

  function sendTokenToServer (token) {
    return fetch('https://sns-taka3sh-org-157419.appspot.com/subscribe/' + token, { method: 'POST' })
    .then(() => token)
  }

  function requestPermission () {
    return messaging.requestPermission()
    .then(() => messaging.getToken())
    .then(currentToken => currentToken
      ? sendTokenToServer(currentToken)
      : console.log('no permission')
    )
  }

  function deleteToken () {
    return messaging.getToken()
    .then(currentToken => messaging.deleteToken(currentToken))
  }

  Vue.filter('date-localize', value => moment(value).format('LLLL'))

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
      notify: value => { localStorage.setItem('notify', JSON.stringify(value)) }
    },
    methods: {
      onToggle: () => {
        if (app.notify) {
          deleteToken()
          .catch(console.log)
          .then(() => { app.notify = false })
        } else {
          app.busy = true
          requestPermission()
          .then(() => { app.notify = true })
          .catch(console.log)
          .then(() => { app.busy = false })
        }
      }
    },
    created: function () {
      moment.locale(navigator.language)

      if (Notification.permission !== 'granted') {
        this.notify = false
      }

      this.posts = Post._fetchCachedPosts()
      this.postKeys = Post._fetchCachedKeys()

      addEventListener('load', () => {
        firebase.initializeApp({
          apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
          databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
          messagingSenderId: '895779023522'
        })
        database = firebase.database()
        messaging = firebase.messaging()

        database.ref('posts').limitToLast(1).once('value', snapshot => {
          if (snapshot.val() === null) {
            app.posts = []
            Post._store()
          }
        })

        database.ref('posts').on('child_added', snapshot => {
          Post._add(snapshot.key, snapshot.val())
          Post._store()

          if (!app.postKeys[snapshot.key]) {
            app.posts.unshift(snapshot.val())
            app.postKeys[snapshot.key] = true
          }
        })

        messaging.onTokenRefresh(() => {
          messaging.getToken()
          .then(sendTokenToServer)
          .catch(e => {
            console.log(e)
          })
        })
      })
    }
  })
})(JSON, localStorage)