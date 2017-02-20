/* globals fetch localStorage Notification */

var NOTIFYSERVICE_ENABLED = 'NotifyService:enabled'

function getEnabled () {
  return localStorage.getItem(NOTIFYSERVICE_ENABLED) === 'true'
}

function setEnabled () {
  localStorage.setItem(NOTIFYSERVICE_ENABLED, 'true')
}

function unsetEnabled () {
  localStorage.removeItem(NOTIFYSERVICE_ENABLED)
}

export default {
  isSupported: function () {
    return 'Notification' in window &&
           'serviceWorker' in navigator
  },

  isPreviouslyEnabled: function () {
    return getEnabled()
  },

  getEnabled: function () {
    return navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
    .then(function (swReg) {
      var tokenSent = getEnabled()
      var notifyAllowed = !!swReg && Notification.permission === 'granted'
      if (tokenSent && !notifyAllowed) {
        setEnabled()
      }
      return tokenSent && notifyAllowed
    })
  },

  init: function (messaging, endpoint) {
    this.messaging = messaging
    this.endpoint = endpoint
  },

  subscribe: function () {
    var self = this

    return self.messaging.requestPermission()
    .then(function () {
      return self.messaging.getToken()
    })
    .then(function (currentToken) {
      return fetch(self.endpoint + currentToken, { method: 'POST' })
    })
    .then(function (response) {
      if (!response.ok) throw new Error(response.statusText)
      setEnabled()
      return self.showGreeting()
    })
  },

  unsubscribe: function () {
    var messaging = this.messaging

    return messaging.getToken()
    .then(function (currentToken) {
      return messaging.deleteToken(currentToken)
    })
    .then(function () {
      unsetEnabled()
    })
  },

  showGreeting: function () {
    navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
    .then(function (swReg) {
      return swReg.showNotification('通知設定が完了しました', {
        body: '新しい投稿がある時、このアイコンの通知が配信されます。',
        icon: '/icon.png'
      })
    })
  }
}
