firebase.initializeApp({
  apiKey: 'AIzaSyCRvuGgcUMJZdptmwAGighs6gU741NLQhs',
  databaseURL: 'https://sns-taka3sh-org.firebaseio.com',
  messagingSenderId: '797345535544',
})
var database = firebase.database()
var messaging = firebase.messaging()

/// Application
var app = new Vue({
  el: '#app',
  data: {
    posts: [],
  },
  methods: {
    localizeDate: function(date) {
      return moment(date).format('LLLL')
    }
  }
})

database.ref('posts').on('child_added', function(data) {
  app.posts.unshift(data.val())
})

/// Messaging

function sendTokenToServer(token) {
  var endpoint = 'https://sns-taka3sh-org-157419.appspot.com/subscribe/' + token
  fetch(endpoint, { method: "POST" })
}

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    sendTokenToServer(refreshedToken)
  })
})

messaging.onMessage(function(payload) {
  console.log(payload)
})

function requestPermission() {
  messaging.requestPermission()
  .then(function() {
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken)
      }
    })
  })
}

requestPermission()
