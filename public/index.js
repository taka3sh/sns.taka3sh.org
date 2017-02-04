/* eslint-env browser */
/* global Vue, firebase, moment */

var config = {
  apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
  databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com',
  messagingSenderId: '895779023522'
}
firebase.initializeApp(config)
var database = firebase.database()
var messaging = firebase.messaging()

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

var app = new Vue({
  el: '#app',
  data: {
    posts: [],
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
    database.ref('posts').on('child_added', function (data) {
      app.posts.unshift(data.val())
    })

    messaging.onTokenRefresh(function () {
      messaging.getToken()
      .then(function (refreshedToken) {
        sendTokenToServer(refreshedToken)
      })
      .catch(function (e) {
        console.log(e)
      })
    })

    if (Notification.permission !== 'granted') {
      this.notifyEnabled = false
    }
  }
})


moment.locale(navigator.language)
