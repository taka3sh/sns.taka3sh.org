/* eslint-disable no-undef */

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis

sw.addEventListener('push', (e: PushEvent) => {
  if (e.data === null) {
    throw new Error('data is null')
  }

  const data = e.data.json()
  e.waitUntil(
    sw.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      data: data.data,
      icon: '/logo192.png'
    })
  )
})
