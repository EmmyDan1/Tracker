self.addEventListener('push', function (event) {
  const data = event.data?.json() ?? {}

  const title = data.title || 'New Delivery'
  const options = {
    body: data.body || 'You have a new delivery assigned',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/',
    },
    requireInteraction: true,
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})