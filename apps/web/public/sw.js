// hieu.asia — service worker cho web push (tử vi mỗi ngày 6h sáng).
// Scope: '/'. Lifecycle: install → activate ngay (skipWaiting + claim).

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    try {
      data = { body: event.data ? event.data.text() : '' };
    } catch {
      data = {};
    }
  }
  const title = data.title || 'hieu.asia — Tử vi hôm nay';
  const options = {
    body: data.body || 'Mở app để xem tử vi của bạn.',
    icon: '/icon.png',
    badge: '/icon.png',
    data: { url: data.url || '/tu-vi-hom-nay' },
    tag: 'daily-horoscope',
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/tu-vi-hom-nay';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
      return null;
    })
  );
});
