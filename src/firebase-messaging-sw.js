/* global addEventListener clients firebase importScripts */

import {
  firebaseMessagingSenderId
} from './constants/development'

importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: firebaseMessagingSenderId
})

addEventListener('notificationclick', function (e) {
  e.notification.close()
  e.waitUntil(clients.openWindow('/'))
})

var messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function () {})
