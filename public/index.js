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
    messagingToken: null,
    requesting: false,
    error: null
  },
  methods: {
    localizeDate: function (date) {
      return moment(date).format('LLLL')
    },
    onToggleNotification: function () {
      app.requesting = true;
      (
        app.messagingToken !== null
        ? deleteToken().then(function () { return null })
        : requestPermission()
      )
      .then(function (currentToken) {
        app.messagingToken = currentToken
      })
      .catch(function (e) {
        app.error = e.code
        console.log(e)
      })
      .then(function () {
        setTimeout(function () {
          app.requesting = false
        }, 1000)
      })
    }
  }
})

database.ref('posts').on('child_added', function (data) {
  app.posts.unshift(data.val())
})

// Messaging

messaging.onTokenRefresh(function () {
  messaging.getToken()
  .then(function (refreshedToken) {
    sendTokenToServer(refreshedToken)
  })
})

messaging.getToken()
.then(function (currentToken) {
  app.messagingToken = currentToken
})
.catch(function (e) {
  console.log(e)
})
