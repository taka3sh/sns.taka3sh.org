/* global addEventListener clients registration */

addEventListener('push', (e) => {
  const data = e.data.json();
  e.waitUntil(
    registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: '/icon.png',
      data: data.data,
    }),
  );
});

addEventListener('notificationclick', (e) => {
  console.log(e);
  e.notification.close();
  e.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
      .then((clientList) => {
        for (const client of clientList) {
          return client.focus();
        }
        return clients.openWindow(`/#${e.notification.data.key}`);
      }),
  );
});
