/* global addEventListener clients firebase importScripts registration */

import {
  firebaseMessagingSenderId
} from './constants/development'

importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: firebaseMessagingSenderId
})

addEventListener('push', function (e) {
  var data = e.data.json()
  e.waitUntil(
    registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: '/icon.png',
      data: data
    })
  )
})

addEventListener('notificationclick', function (e) {
  console.log(e.notification.data.from)
  e.notification.close()
  e.waitUntil(clients.openWindow('/'))
})
