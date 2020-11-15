/* global addEventListener clients registration */

addEventListener('push', function (e) {
  var data = e.data.json()
  e.waitUntil(
    registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: '/icon.png',
      data: data.data
    })
  )
})

addEventListener('notificationclick', function (e) {
  console.log(e)
  e.notification.close()
  e.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
      .then(function (clientList) {
        for (var client of clientList) {
          return client.focus()
        }
        return clients.openWindow('/#' + e.notification.data.key)
      })
  )
})
