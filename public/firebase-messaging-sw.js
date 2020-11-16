window.addEventListener('push', (e) => {
  const data = e.data.json();
  e.waitUntil(
    window.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: '/icon.png',
      data: data.data,
    }),
  );
});

window.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    window.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
      .then((clientList) => {
        clientList.array.forEach(() => window.client.focus());
        return window.clients.openWindow(`/#${e.notification.data.key}`);
      }),
  );
});
