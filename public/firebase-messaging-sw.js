/* global addEventListener clients firebase importScripts */

importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: '895779023522'
})

firebase.messaging()

addEventListener('notificationclick', function (e) {
  console.log('notificationclick')
  e.notification.close()
  e.waitUntil(clients.openWindow('/'))
})
