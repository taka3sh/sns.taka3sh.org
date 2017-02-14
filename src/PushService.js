/* globals fetch localStorage Notification */

export default {
  init: function (messaging, projectid) {
    var self = this
    self.messaging = messaging
    self.projectid = projectid
  },

  isEnabled: function () {
    return Notification.permission === 'granted' &&
           navigator.serviceWorker.controller &&
           localStorage.getItem('PushService.tokenSent') === 'true'
  },

  subscribe: function () {
    var self = this

    return Promise.all([
      self.installServiceWorker(),
      self.messaging.requestPermission()
    ])
    .then(function () {
      return self.messaging.getToken()
    })
    .then(function (currentToken) {
      return fetch('https://' + self.projectid + '.appspot.com/subscribe/' + currentToken, { method: 'POST' })
    })
    .then(function () {
      localStorage.setItem('PushService.tokenSent', 'true')
    })
  },

  unsubscribe: function () {
    var self = this

    return self.installServiceWorker()
    .then(function () {
      return self.messaging.getToken()
    })
    .then(function (currentToken) {
      return self.messaging.deleteToken(currentToken)
    })
    .then(function () {
      localStorage.removeItem('PushService.tokenSent')
    })
  },

  installServiceWorker: function () {
    var messaging = this.messaging

    if (!this.registration) {
      this.registration = navigator.serviceWorker.register('sw.js')
      .then(function (swReg) {
        messaging.useServiceWorker(swReg)
        return swReg
      })
    }

    return this.registration
  }
}
