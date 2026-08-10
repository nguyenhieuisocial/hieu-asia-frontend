// hieu.asia — service worker.
//
// Hai việc, cố ý tách bạch:
//   1. Web push (tử vi mỗi ngày 6h sáng) — có từ đầu.
//   2. Lớp offline tối thiểu — thêm 10/08/2026.
//
// Scope: '/'. Lifecycle: install → activate ngay (skipWaiting + claim).
//
// ⚠️ NGUYÊN TẮC CACHE — đọc trước khi mở rộng file này:
// Cache sai ở service worker tạo ra loại bug tệ nhất: người dùng kẹt ở bản cũ
// và KHÔNG có cách nào tự thoát ngoài xoá dữ liệu site. Nên ở đây cố ý hẹp:
//   • Điều hướng (mở trang) → LUÔN đi mạng trước, chỉ khi mạng chết mới trả
//     `/offline`. Không bao giờ phục vụ HTML từ cache ⇒ không bao giờ có
//     chuyện nội dung cũ hiện ra như thật.
//   • Chỉ cache asset có băm nội dung trong tên (`/_next/static/*`, `/fonts/*`)
//     — URL đổi mỗi lần build nên không thể cũ.
//   • KHÔNG đụng `/api/*`, không đụng HTML trang luận giải, không đụng request
//     khác GET, không đụng origin khác. Mọi thứ ngoài hai nhánh trên được thả
//     cho trình duyệt xử lý y như khi không có service worker.
// Muốn thêm nhánh cache mới: phải trả lời được "nếu bản này cũ thì người dùng
// thoát ra bằng cách nào" trước đã.

const PHIEN_BAN_CACHE = 'v1';
const CACHE_VO = `hieu-shell-${PHIEN_BAN_CACHE}`;
const CACHE_ASSET = `hieu-asset-${PHIEN_BAN_CACHE}`;
const CACHE_DANG_DUNG = [CACHE_VO, CACHE_ASSET];
const DUONG_OFFLINE = '/offline';

self.addEventListener('install', (event) => {
  // Precache đúng MỘT trang. `cache: 'reload'` để không precache nhầm bản cũ
  // đang nằm trong HTTP cache của trình duyệt.
  event.waitUntil(
    caches
      .open(CACHE_VO)
      .then((cache) => cache.add(new Request(DUONG_OFFLINE, { cache: 'reload' })))
      .catch(() => {
        // Precache hỏng KHÔNG được chặn install — thà có SW chạy phần push còn
        // hơn không có gì. Nhánh offline sẽ tự thiếu và fetch handler đã lường.
      }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Xoá cache của phiên bản trước. Chỉ đụng cache mang tiền tố của mình để
      // không giẫm lên cache do thứ khác trên cùng origin tạo ra.
      const ten = await caches.keys();
      await Promise.all(
        ten
          .filter((n) => n.startsWith('hieu-') && !CACHE_DANG_DUNG.includes(n))
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Asset có băm nội dung trong tên ⇒ URL đổi mỗi build ⇒ cache vĩnh viễn an toàn. */
function laAssetBatBien(url) {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Không đụng: request khác GET, origin khác, và toàn bộ API.
  if (req.method !== 'GET') return;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Điều hướng: network-first, rớt mạng thì trả trang offline đã precache.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch {
          const cache = await caches.open(CACHE_VO);
          const duPhong = await cache.match(DUONG_OFFLINE);
          // Thiếu bản precache (install lỗi) thì trả lỗi mạng như bình thường —
          // KHÔNG bịa ra một Response rỗng, vì trang trắng khó hiểu hơn lỗi thật.
          return duPhong ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Asset bất biến: cache-first.
  if (laAssetBatBien(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_ASSET);
        const trung = await cache.match(req);
        if (trung) return trung;
        const res = await fetch(req);
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      })(),
    );
  }

  // Mọi thứ còn lại: không gọi respondWith ⇒ trình duyệt tự xử lý y như cũ.
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
    // 10/08/2026 — sửa đường chết: trước đây trỏ '/icon.png', mà file đó KHÔNG
    // tồn tại (kiểm production: 404). Nó từng do route code-gen `icon.tsx` sinh
    // ra, route đã bị xoá ở commit f945bed khi chuyển sang PNG tĩnh của founder
    // nhưng chỗ này bị bỏ sót ⇒ mọi thông báo đẩy đều hiện không có icon.
    icon: '/icon-192.png',
    badge: '/icon-192.png',
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
    }),
  );
});
