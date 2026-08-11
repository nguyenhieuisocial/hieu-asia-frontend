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
//   • Chỉ cache asset có băm nội dung trong tên — hiện ĐÚNG MỘT nhánh:
//     `/_next/static/*`. Next băm nội dung vào tên file nên URL đổi mỗi build,
//     bản cũ không bao giờ được yêu cầu lại ⇒ không thể kẹt.
//     ⚠️ `/fonts/*` TỪNG nằm trong danh sách này và đó là SAI — đã gỡ
//     2026-08-11. Thư mục đó chỉ có `noto-serif-sc-han.woff2`, tên CỐ ĐỊNH,
//     không băm. Cache-first một URL cố định = thay file font thì người đã ghé
//     site giữ bản cũ VĨNH VIỄN, không có cách tự thoát. Nhánh đó không qua
//     được chính cửa ải ghi ở cuối khối này. Font vốn đã có HTTP cache của
//     trình duyệt nên lợi ích thêm gần bằng 0, còn rủi ro thì vĩnh viễn.
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
      // Xoá cache VỎ của phiên bản trước. Chỉ đụng cache mang tiền tố của mình
      // để không giẫm lên cache do thứ khác trên cùng origin tạo ra.
      //
      // ⚠️ CỐ Ý KHÔNG xoá cache ASSET cũ (`hieu-asset-*`). Có `skipWaiting()` +
      // `clients.claim()` nên service worker mới chiếm quyền các tab ĐANG MỞ
      // ngay lập tức. Tab đó vẫn chạy JS của build cũ và sẽ còn xin những chunk
      // của build cũ; xoá cache asset dưới chân nó là chunk phải đi ra mạng,
      // mà build mới đã thay thế ⇒ 404 ⇒ trang vỡ giữa phiên, đúng lúc người
      // dùng có thể đang gõ dở biểu mẫu. Hôm nay chưa nổ chỉ vì số phiên bản
      // chưa bao giờ đổi — nhưng cái bẫy đã nằm sẵn cho lần bump đầu tiên.
      //
      // Đánh đổi: cache asset chỉ tăng, không tự co. Chấp nhận được vì trình
      // duyệt tự thu hồi theo LRU khi chạm hạn mức lưu trữ, còn chunk đều có
      // băm nội dung nên bản cũ không bao giờ bị phục vụ nhầm — nó chỉ nằm đó.
      const ten = await caches.keys();
      await Promise.all(
        ten
          .filter((n) => n.startsWith('hieu-shell-') && !CACHE_DANG_DUNG.includes(n))
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

/**
 * Asset có băm nội dung trong tên ⇒ URL đổi mỗi build ⇒ cache vĩnh viễn an toàn.
 * CHỈ `/_next/static/*`. Đừng thêm đường nào có tên file cố định — xem khối
 * NGUYÊN TẮC CACHE ở đầu file, mục `/fonts/*`.
 */
function laAssetBatBien(url) {
  return url.pathname.startsWith('/_next/static/');
}

/**
 * Ở localhost, `/_next/static/*` KHÔNG băm theo nội dung — cùng một URL nhưng
 * nội dung đổi mỗi lần sửa code. Cache-first ở đó = ghim bản cũ, đúng cái bug
 * "sửa rồi mà không thấy đổi".
 *
 * Chốt đặt ở ĐÂY chứ không chỉ ở chỗ đăng ký: hiện có hai nơi gọi `register()`
 * và chỉ một nơi có chốt production. Chặn ngay trong service worker thì dù mai
 * này có nơi thứ ba đăng ký, hoặc máy dev đã lỡ đăng ký từ trước rồi tự nâng
 * cấp lên bản này, nhánh cache vẫn không chạm vào localhost.
 */
const LA_MAY_DEV =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '[::1]';

/** Đã làm tươi `/offline` trong vòng đời service worker này chưa. */
let daLamTuoiOffline = false;

/**
 * Làm tươi bản `/offline` đã cache — ĐÚNG MỘT LẦN mỗi vòng đời service worker.
 *
 * VÌ SAO BẮT BUỘC (hai lỗi thật, không phải phòng xa):
 *
 * 1. `/offline` chỉ được ghi ở `install`, mà `install` chỉ chạy khi BYTE của
 *    `sw.js` đổi. File này là file tĩnh trong `public/`, không có bước build
 *    nào đóng dấu build-id vào nó ⇒ mọi deploy chỉ sửa `offline/page.tsx` đều
 *    KHÔNG làm tươi bản đã cache. Sau vài deploy, HTML cũ đó còn trỏ tới
 *    `/_next/static/css/<hash>.css` của build cũ — URL nay 404 ⇒ người mất
 *    mạng nhận trang offline KHÔNG CÓ CSS, chữ trần trên nền trắng. Đúng lúc
 *    cần trấn an nhất thì trông giống trang lỗi nhất.
 *
 * 2. Nếu `install` rơi trúng lúc bật chế độ bảo trì, middleware **rewrite**
 *    `/offline` sang trang bảo trì và trả HTTP 200 ⇒ `cache.add` thành công,
 *    lưu trang "đang bảo trì" dưới khoá `/offline`. Hết bảo trì rồi nhưng cache
 *    vẫn giữ nguyên: người mất mạng đọc "hệ thống đang bảo trì", ngồi đợi thay
 *    vì đi kiểm tra Wi-Fi. Sai thông tin, và tự nó không bao giờ hết.
 *
 * Cách này tự chữa cả hai: mỗi lần người dùng online và điều hướng, bản offline
 * được viết lại từ mạng. Không cần thêm bước build, không cần ai nhớ bump số
 * phiên bản cache.
 *
 * Chốt `res.redirected`: nếu response đến từ một đường vòng (rewrite bảo trì,
 * chuyển hướng đăng nhập) thì KHÔNG ghi đè — thà giữ bản cũ còn hơn thay bằng
 * trang sai nội dung.
 */
async function lamTuoiOffline() {
  if (daLamTuoiOffline) return;
  daLamTuoiOffline = true;
  try {
    const res = await fetch(new Request(DUONG_OFFLINE, { cache: 'reload' }));
    if (!res || !res.ok || res.redirected) return;
    const cache = await caches.open(CACHE_VO);
    await cache.put(DUONG_OFFLINE, res);
  } catch {
    // Mạng chập chờn giữa chừng — giữ nguyên bản cũ, thử lại ở vòng đời sau.
  }
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
          const res = await fetch(req);
          // Nhân lúc đang có mạng, làm tươi bản `/offline` đã cache (xem
          // `lamTuoiOffline` để biết vì sao việc này là BẮT BUỘC, không phải
          // tối ưu). Chạy nền, không giữ response lại chờ nó.
          event.waitUntil(lamTuoiOffline());
          return res;
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

  // Asset bất biến: cache-first. Bỏ qua hoàn toàn ở máy dev (xem LA_MAY_DEV).
  if (!LA_MAY_DEV && laAssetBatBien(url)) {
    event.respondWith(
      (async () => {
        // ⚠️ try/catch BẮT BUỘC, không phải phòng xa. Cache Storage CÓ THỂ ném
        // lỗi ngoài tầm kiểm soát của ta (Chrome: "UnknownError" khi DB hồ sơ
        // hỏng; Safari: chính sách lưu trữ chặn). Không bắt thì mọi request
        // `/_next/static/*` cùng reject ⇒ không JS, không CSS ⇒ TRANG TRẮNG
        // HOÀN TOÀN, và người dùng không tự thoát được vì chính SW gây ra —
        // tải lại bao nhiêu lần cũng vậy.
        // Đó sẽ là phản bội đúng lời hứa ghi ở `ServiceWorkerRegistrar`: service
        // worker là lớp TĂNG CƯỜNG, không bao giờ được phép làm hỏng trang.
        // Cache hỏng thì chỉ mất phần tăng tốc; trang vẫn chạy bằng mạng.
        try {
          const cache = await caches.open(CACHE_ASSET);
          const trung = await cache.match(req);
          if (trung) return trung;
          const res = await fetch(req);
          // `cache.put` cố ý KHÔNG await (không bắt response phải chờ ghi cache)
          // nhưng PHẢI có `.catch` — hết quota là nó reject, thành unhandled
          // rejection trong SW và ta mất luôn tín hiệu cache đã ngừng hoạt động.
          if (res && res.status === 200) {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        } catch {
          return fetch(req);
        }
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
