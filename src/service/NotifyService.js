/* globals fetch localStorage Notification */

export default {
  init: function (messaging, endpoint) {
    this.messaging = messaging
    this.endpoint = endpoint
  },

  isSupported: function () {
    return 'Notification' in window &&
           'serviceWorker' in navigator
  },

  isEnabled: function () {
    return this.isSupported() &&
           Notification.permission === 'granted' &&
           navigator.serviceWorker.controller &&
           localStorage.getItem('PushService.tokenSent') === 'true'
  },

  subscribe: function () {
    var messaging = this.messaging
    var endpoint = this.endpoint

    return Promise.all([
      this.installServiceWorker(),
      messaging.requestPermission()
    ])
    .then(function () {
      return messaging.getToken()
    })
    .then(function (currentToken) {
      return fetch(endpoint + currentToken, { method: 'POST' })
    })
    .then(function () {
      localStorage.setItem('PushService.tokenSent', 'true')
    })
  },

  unsubscribe: function () {
    var messaging = this.messaging

    return this.installServiceWorker()
    .then(function () {
      return messaging.getToken()
    })
    .then(function (currentToken) {
      return messaging.deleteToken(currentToken)
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
