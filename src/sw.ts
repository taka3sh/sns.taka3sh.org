/* eslint-disable no-undef */
/// <reference no-default-lib="true"/>
/// <reference lib="ESNext" />
/// <reference lib="WebWorker" />

const sw = self as ServiceWorkerGlobalScope & typeof globalThis

sw.addEventListener('push', (e: PushEvent) => {
  const data = e.data.json()
  e.waitUntil(
    sw.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      data: data.data,
      icon: '/logo192.png'
    })
  )
})
