/* globals fetch localStorage Notification */

export default {
  isSupported: function () {
    return 'Notification' in window &&
           'serviceWorker' in navigator
  },

  isEnabled: function () {
    if (this.isSupported()) {
      return navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
      .then(function (swReg) {
        return swReg && Notification.permission === 'granted' && localStorage.getItem('PushService.tokenSent') === 'true'
      })
    } else {
      return Promise.resolve(false)
    }
  },

  init: function (messaging, endpoint) {
    this.messaging = messaging
    this.endpoint = endpoint
  },

  subscribe: function () {
    var self = this

    return Promise.all([
      self.installServiceWorker(),
      self.messaging.requestPermission()
    ])
    .then(function (swReg) {
      return self.messaging.getToken()
      .then(function (currentToken) {
        return fetch(self.endpoint + currentToken, { method: 'POST' })
      })
      .then(function () {
        localStorage.setItem('PushService.tokenSent', 'true')
        self.showGreeting(swReg[0])
      })
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
      this.registration = navigator.serviceWorker.register('firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope'
      })
      .then(function (swReg) {
        messaging.useServiceWorker(swReg)
        return swReg
      })
    }

    return this.registration
  },

  showGreeting: function (swReg) {
    swReg.showNotification('Greeting', {
      body: 'Hey! The notification service is now working!',
      icon: '/icon.png'
    })
  }
}
