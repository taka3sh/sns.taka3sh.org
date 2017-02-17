/* globals fetch localStorage Notification */

export default {
  isTokenSent: function () {
    return localStorage.getItem('NotifyService.tokenSent') === 'true'
  },

  isSupported: function () {
    return 'Notification' in window &&
           'serviceWorker' in navigator
  },

  isPreviouslyEnabled: function () {
    return localStorage.getItem('NotifyService.enabled') === 'true'
  },

  getEnabled: function () {
    var self = this

    return navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
    .then(function (swReg) {
      var value = !!swReg && Notification.permission === 'granted' && self.isTokenSent()
      localStorage.setItem('NotifyService.enabled', value)
      return value
    })
  },

  init: function (messaging, endpoint) {
    this.messaging = messaging
    this.endpoint = endpoint
  },

  subscribe: function () {
    var self = this

    return self.installServiceWorker()
    .then(function (swReg) {
      return self.messaging.requestPermission()
      .then(function () {
        return self.messaging.getToken()
      })
      .then(function (currentToken) {
        return fetch(self.endpoint + currentToken, { method: 'POST' })
      })
      .then(function (response) {
        if (!response.ok) throw new Error(response.statusText)
        localStorage.setItem('NotifyService.tokenSent', 'true')
        self.showGreeting(swReg)
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
      localStorage.removeItem('NotifyService.tokenSent')
    })
  },

  installServiceWorker: function () {
    var messaging = this.messaging

    if (!this.isSupported()) {
      return Promise.reject(new Error('Service Worker is not supported.'))
    }

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
