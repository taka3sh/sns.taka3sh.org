window.addEventListener('push', (e) => {
  const data = e.data.json()
  e.waitUntil(
    window.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      data: data.data,
      icon: '/icon.png',
    })
  )
})

window.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    window.clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then((clientList) => {
        clientList.array.forEach(() => window.client.focus())
        return window.clients.openWindow(`/#${e.notification.data.key}`)
      })
  )
})
