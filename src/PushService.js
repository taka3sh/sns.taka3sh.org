/* globals fetch */

export var PushService = {
  init: function (messaging, projectid) {
    var self = this
    self.messaging = messaging
    self.projectid = projectid
  },

  subscribe: function () {
    var self = this

    return self.messaging.requestPermission()
    .then(function () {
      return self.getToken()
    })
    .then(function (currentToken) {
      return fetch('https://' + self.projectid + '.appspot.com/subscribe/' + currentToken, { method: 'POST' })
    })
  },

  unsubscribe: function () {
    var self = this

    return self.getToken()
    .then(function (currentToken) {
      return self.messaging.deleteToken(currentToken)
    })
  },

  getToken: function () {
    var self = this

    if (!self.registration) {
      self.registration = navigator.serviceWorker.register('firebase-messaging-sw.js')
    }

    self.registration.then(function () {
      return self.messaging.getToken()
    })
  }
}
