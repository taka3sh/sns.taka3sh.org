addEventListener('push', (e) => {
  const data = e.data.json()
  e.waitUntil(
    registration.showNotification(data.notification.title, {
      body: data.notification.body,
      data: data.data,
      icon: '/icon.png',
    })
  )
})

addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then((clientList) => {
        clientList.array.forEach(() => window.client.focus())
        return clients.openWindow(`/#${e.notification.data.key}`)
      })
  )
})
