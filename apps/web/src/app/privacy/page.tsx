import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ReopenCmpButton } from '@/components/cmp/ReopenCmpButton';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb } from '@/lib/seo/jsonld';

// Trang có in năm © lấy từ `new Date()`. Server component tĩnh thì năm đó bị
// nướng vào HTML lúc build và đứng yên tới lần deploy sau — sang 01/01 là thân
// trang ghi năm cũ trong khi chân trang (client component) đã nhảy năm mới, tức
// hai dòng © trên CÙNG một trang nói khác nhau. Web không có lịch dựng lại định
// kỳ nên khoảng lệch là thật.
export const revalidate = 86400;
export const metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Cam kết bảo vệ dữ liệu cá nhân tại hieu.asia, tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.',
  alternates: { canonical: 'https://hieu.asia/privacy' },
};

const LAST_UPDATED = '22/05/2026 (Wave 41)';

interface CookieRow {
  name: string;
  purpose: string;
  retention: string;
  optOut: string;
  category: 'necessary' | 'analytics' | 'marketing' | 'personalization';
}

// Wave 41 — full cookie inventory documented per NĐ 13/2023.
const COOKIES: CookieRow[] = [
  {
    name: 'hieu_authed',
    purpose: 'Cờ "đã đăng nhập" cho SSR (chỉ giá trị "1", KHÔNG chứa token/JWT)',
    retention: '90 ngày',
    optOut: 'Đăng xuất',
    category: 'necessary',
  },
  {
    name: 'hieu_attr',
    purpose: 'Attribution (UTM, fbclid, gclid, ttclid, msclkid, twclid, dclid, hieu_ref)',
    retention: '90 ngày',
    optOut: 'CMP banner / xoá cookie trình duyệt',
    category: 'necessary',
  },
  {
    name: 'hieu_consent_*',
    purpose: 'Trạng thái đồng ý cookie (shown / analytics / marketing / personalization)',
    retention: '365 ngày',
    optOut: 'Cài đặt trình duyệt',
    category: 'necessary',
  },
  {
    name: 'hieu.theme',
    purpose: 'Lựa chọn giao diện sáng/tối',
    retention: '365 ngày',
    optOut: 'Cài đặt trình duyệt',
    category: 'personalization',
  },
  {
    name: 'hieu.locale',
    purpose: 'Ngôn ngữ hiển thị',
    retention: '365 ngày',
    optOut: 'Cài đặt trình duyệt',
    category: 'personalization',
  },
  {
    name: 'ph_phc_*_posthog',
    purpose: 'PostHog distinct_id + session_id (analytics + session replay)',
    retention: '365 ngày',
    optOut: 'CMP — tắt Analytics',
    category: 'analytics',
  },
  {
    name: '_fbp',
    purpose: 'Facebook Pixel — tracking ID phiên (chỉ tải sau khi opt-in Marketing)',
    retention: '90 ngày',
    optOut: 'CMP — tắt Marketing',
    category: 'marketing',
  },
  {
    name: '_gcl_*',
    purpose: 'Google Ads conversion (chỉ tải sau khi opt-in Marketing)',
    retention: '90 ngày',
    optOut: 'CMP — tắt Marketing',
    category: 'marketing',
  },
  {
    name: '_ttp',
    purpose: 'TikTok Pixel (chỉ tải sau khi opt-in Marketing)',
    retention: '13 tháng',
    optOut: 'CMP — tắt Marketing',
    category: 'marketing',
  },
];

interface SubProcessor {
  vendor: string;
  purpose: string;
  dataShared: string;
  location: string;
  retention: string;
  policyUrl: string;
}

const SUB_PROCESSORS: SubProcessor[] = [
  {
    vendor: 'Anthropic (Claude)',
    purpose: 'Soạn báo cáo Tử Vi, Mentor chat',
    dataShared: 'Lá số (không có tên thật/ngày sinh gốc), câu hỏi Mentor',
    location: 'Hoa Kỳ',
    retention: 'Không lưu (zero-retention API)',
    policyUrl: 'https://www.anthropic.com/legal/privacy',
  },
  {
    vendor: 'OpenAI (GPT)',
    purpose: 'Logic + fallback alignment',
    dataShared: 'Prompt ẩn danh hoá',
    location: 'Hoa Kỳ',
    retention: '30 ngày (theo enterprise API)',
    policyUrl: 'https://openai.com/policies/privacy-policy',
  },
  {
    vendor: 'Google (Gemini Vision)',
    purpose: 'OCR + phân tích đặc điểm bàn tay',
    dataShared: 'Ảnh bàn tay (không kèm danh tính)',
    location: 'Hoa Kỳ',
    retention: 'Không lưu (API-only)',
    policyUrl: 'https://policies.google.com/privacy',
  },
  {
    vendor: 'Cloudflare',
    purpose: 'Hosting Workers, R2 storage, CDN',
    dataShared: 'HTTP traffic, file uploads, cache',
    location: 'Toàn cầu (edge); chính: Hoa Kỳ',
    retention: 'Logs 24-72h; R2 theo policy bên dưới',
    policyUrl: 'https://www.cloudflare.com/privacypolicy/',
  },
  {
    vendor: 'Vercel',
    purpose: 'Frontend hosting Next.js',
    dataShared: 'HTTP request metadata, build artifacts',
    location: 'Hoa Kỳ',
    retention: 'Logs 30 ngày',
    policyUrl: 'https://vercel.com/legal/privacy-policy',
  },
  {
    vendor: 'Vercel Analytics',
    purpose: 'Đếm số lượt truy cập + nguồn truy cập (privacy-first, không cookie)',
    dataShared: 'URL trang, referrer, region (không IP, không cookie)',
    location: 'Vercel Edge (US/EU)',
    retention: '30 ngày (rolling)',
    policyUrl: 'https://vercel.com/legal/privacy-policy',
  },
  {
    vendor: 'Vercel Speed Insights',
    purpose: 'Đo Core Web Vitals (LCP, CLS, INP) qua browser PerformanceObserver',
    dataShared: 'Web Vitals metrics + URL path (không cookie, không PII)',
    location: 'Vercel Edge',
    retention: 'Aggregate (không lưu phiên cá nhân)',
    policyUrl: 'https://vercel.com/legal/privacy-policy',
  },
  {
    vendor: 'Supabase',
    purpose: 'Database Postgres, Auth, Edge Functions',
    dataShared: 'User profile, reading records, audit log',
    location: 'Singapore (ap-southeast-1)',
    retention: 'Theo retention chính sách bên trên',
    policyUrl: 'https://supabase.com/privacy',
  },
  {
    vendor: 'SePay',
    purpose: 'Xử lý thanh toán QR (Việt Nam)',
    dataShared: 'Số tiền, mã giao dịch, ngân hàng',
    location: 'Việt Nam',
    retention: 'Theo quy định NHNN (10 năm)',
    policyUrl: 'https://sepay.vn/dieu-khoan',
  },
  {
    vendor: 'PostHog',
    purpose:
      'Product analytics (sự kiện UI, session replay, heatmap, feature flag). IP capture mặc định bật ($ip) để chống fraud và geo-segment — bạn có thể tắt bằng cách tắt analytics trong /account.',
    dataShared:
      'Sự kiện UI, distinct_id ẩn danh hoặc user_id sau khi đăng nhập, IP ($ip), user-agent, super-properties (locale/timezone/viewport). Không gửi email/họ tên thô cho miniapp; web app gửi email sau khi đăng nhập.',
    location: 'Hoa Kỳ (us.i.posthog.com — PostHog US Cloud)',
    retention: 'Sự kiện 12 tháng; session replay 30 ngày (PostHog Cloud defaults)',
    policyUrl: 'https://posthog.com/privacy',
  },
  {
    vendor: 'Plausible',
    purpose: 'Page-view analytics (cookieless, GDPR-friendly)',
    dataShared: 'URL truy cập, referer, user-agent rút gọn (không IP, không cookie)',
    location: 'EU (Đức)',
    retention: 'Aggregate vô thời hạn; raw 6 tháng',
    policyUrl: 'https://plausible.io/privacy',
  },
  {
    vendor: 'Sentry',
    purpose: 'Error tracking',
    dataShared: 'Stack trace, browser metadata',
    location: 'Hoa Kỳ',
    retention: '90 ngày',
    policyUrl: 'https://sentry.io/privacy/',
  },
  {
    vendor: 'Resend',
    purpose: 'Email giao dịch (magic-link, OTP)',
    dataShared: 'Email + nội dung email',
    location: 'Hoa Kỳ',
    retention: 'Logs 30 ngày',
    policyUrl: 'https://resend.com/legal/privacy-policy',
  },
  {
    vendor: 'Telegram',
    purpose: 'Bot login + notification',
    dataShared: 'Telegram User ID (không kèm tên hieu.asia)',
    location: 'EU/Anh',
    retention: 'Theo policy Telegram',
    policyUrl: 'https://telegram.org/privacy',
  },
  {
    vendor: 'Langfuse',
    purpose: 'LLM observability (cost + latency)',
    dataShared: 'Prompt + completion ẩn danh hoá',
    location: 'EU',
    retention: '30 ngày',
    policyUrl: 'https://langfuse.com/privacy',
  },
  // Wave 41 — Marketing pixels. CHỈ tải sau khi bạn opt-in qua CMP banner.
  // Khi không opt-in, KHÔNG có request nào được gửi tới các vendor này từ
  // trình duyệt của bạn — cookie cũng KHÔNG được set.
  {
    vendor: 'Facebook / Meta (Pixel + CAPI)',
    purpose:
      'Retargeting + conversion tracking (Pixel + Conversions API). Chỉ tải sau khi opt-in Marketing trong CMP banner.',
    dataShared:
      'Pixel: IP, user-agent, URL, click-IDs (fbclid). CAPI server-side: hashed email/phone (SHA-256), IP. Có dedup bằng eventID.',
    location: 'Hoa Kỳ / EU (mạng CDN toàn cầu)',
    retention: 'Cookie `_fbp` 90 ngày. Sự kiện CAPI: theo policy Meta.',
    policyUrl: 'https://www.facebook.com/policy.php',
  },
  {
    vendor: 'Google Ads',
    purpose:
      'Conversion tag (gtag) — đo hiệu quả quảng cáo Google Ads. Chỉ tải sau khi opt-in Marketing.',
    dataShared: 'IP, user-agent, URL, conversion event (value + currency)',
    location: 'Hoa Kỳ',
    retention: 'Cookie `_gcl_*` 90 ngày',
    policyUrl: 'https://policies.google.com/privacy',
  },
  {
    vendor: 'TikTok (ByteDance) Pixel',
    purpose: 'Retargeting + conversion. Chỉ tải sau khi opt-in Marketing.',
    dataShared: 'IP, user-agent, URL, click-ID (ttclid)',
    location: 'Singapore / Hoa Kỳ',
    retention: 'Cookie `_ttp` 13 tháng',
    policyUrl: 'https://www.tiktok.com/legal/page/row/privacy-policy/en',
  },
];

// Vendor có dùng IP — disclose theo NĐ 13/2023.
const IP_USING_VENDORS = [
  'Cloudflare',
  'Vercel',
  'Supabase',
  'Sentry',
  'PostHog ($ip mặc định bật)',
  'Facebook / Meta (Pixel + CAPI, chỉ khi opt-in Marketing)',
  'Google Ads (chỉ khi opt-in Marketing)',
  'TikTok Pixel (chỉ khi opt-in Marketing)',
];

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background pt-24 text-foreground">

      <section id="nd-13-2023" className="container mx-auto max-w-3xl scroll-mt-24 px-6 pb-20 pt-6">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Chính sách bảo mật dữ liệu cá nhân
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cập nhật lần cuối: <span className="text-gold-700">{LAST_UPDATED}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            Chính sách này mô tả cách hieu.asia thu thập, lưu trữ và sử dụng dữ liệu cá nhân của bạn,
            tuân thủ <strong className="text-gold-700">Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</strong> và{' '}
            <strong className="text-gold-700">Nghị định 356/2025/NĐ-CP</strong> (hiệu lực 01/01/2026, thay thế
            Nghị định 13/2023/NĐ-CP).
          </p>
        </div>

        <h2 className="sr-only">1. Người thu thập dữ liệu</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">1. Người thu thập dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              <strong className="text-foreground">hieu.asia</strong> — nền tảng AI cá nhân hoá giúp bạn hiểu mình.
            </p>
            <p>
              Mọi câu hỏi về dữ liệu, vui lòng liên hệ:{' '}
              <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
            </p>
          </CardContent>
        </Card>

        <h2 className="sr-only">2. Loại dữ liệu chúng tôi thu thập</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">2. Loại dữ liệu chúng tôi thu thập</CardTitle>
            <CardDescription>Chỉ thu thập dữ liệu cần thiết để tạo báo cáo cho bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Họ tên (hoặc biệt danh), ngày — tháng — năm — giờ sinh, nơi sinh.</li>
              <li>Ảnh lòng bàn tay; ảnh chân dung (tuỳ chọn, có thể bỏ qua).</li>
              <li>Câu trả lời khảo sát MBTI và 3 câu hỏi bối cảnh nghề nghiệp.</li>
              <li>Telegram User ID nếu bạn đăng nhập qua bot Telegram.</li>
              <li>Lịch sử cuộc trò chuyện với Mentor AI.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">3. Mục đích sử dụng</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">3. Mục đích sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Tạo báo cáo phân tích cá nhân (Tử Vi + MBTI + tâm lý) dành riêng cho bạn.</li>
              {/* Nghĩa vụ thông báo TRƯỚC KHI thu thập (Luật BVDLCN 91/2025). Cơ sở
                  xử lý: Điều 19.1.4 — "thực hiện thoả thuận của chủ thể dữ liệu với
                  tổ chức", tức cung cấp chính tính năng người dùng đã đăng ký; KHÔNG
                  phải cookie personalization. Ai đổi hành vi đồng bộ phải sửa cả mục
                  này + Hỏi–Đáp ở /tra-cuu-tuoi + lib/birth-profile.ts. */}
              <li>
                <strong className="text-foreground">Ghi nhớ ngày sinh giữa các công cụ.</strong>{' '}
                Khi bạn <strong className="text-foreground">đã đăng nhập</strong>, ngày — giờ sinh
                được lưu vào tài khoản để các công cụ tự điền sẵn và bạn dùng lại được trên thiết
                bị khác, không phải nhập lại. Khi bạn{' '}
                <strong className="text-foreground">chưa đăng nhập</strong>, thông tin này chỉ nằm
                trong trình duyệt của bạn và không được gửi lên máy chủ. Bạn gỡ bất cứ lúc nào bằng
                nút <em>Xoá</em> ngay cạnh dòng thông tin đã lưu ở mỗi công cụ — thao tác này xoá cả
                bản trên máy lẫn bản trong tài khoản.
              </li>
              <li>
                <strong className="text-foreground">Không dùng dữ liệu cá nhân để huấn luyện mô hình.</strong>{' '}
                Chỉ dùng dữ liệu đã ẩn danh để cải thiện prompt — bạn có thể tắt
                tùy chọn này bất cứ lúc nào trong{' '}
                <Link href="/account" className="text-gold-700 underline">
                  Tài khoản
                </Link>
                .
              </li>
              <li>
                <strong className="text-gold-700">Chúng tôi KHÔNG bán dữ liệu cá nhân cho bất kỳ bên thứ ba nào.</strong>
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">4. Thời gian lưu trữ</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">4. Thời gian lưu trữ</CardTitle>
            <CardDescription>Chúng tôi xóa dữ liệu nhạy cảm sớm nhất có thể.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            {/*
              KIỂM CHỨNG 04/08/2026 — câu cũ ở đây ghi "TỰ ĐỘNG XÓA SAU 7 NGÀY", tức
              ngụ ý ảnh CÓ được lưu. Đã truy cả hai repo và điều đó KHÔNG đúng:
                • /xem-tuong nén ảnh trong trình duyệt rồi gửi thẳng trong thân yêu cầu
                  tới handler /tools/vision-read; handler chuyển tiếp cho mô hình và
                  không gọi R2 / Supabase Storage / DB nào (backend src/index.ts).
                • Ba luồng upload ảnh tay (web /reading/[id]/upload, mini-app Telegram,
                  mini-app Zalo) đều gọi /v1/uploads/hand-image-url — route KHÔNG tồn
                  tại trong worker (không có route /v1/* nào), nên luôn rơi vào nhánh
                  dự phòng URL.createObjectURL: ảnh không rời khỏi trình duyệt.
              Đường ghi ảnh POST /upload (key palm/, face/) và cron dọn 7 ngày VẪN là
              mã sống — chỉ là chưa client nào gọi. Vì vậy câu chữ dưới đây nói "hiện
              không có luồng nào gửi ảnh lên lưu trữ", KHÔNG nói "hệ thống không thể
              lưu ảnh". Nếu sau này nối lại luồng upload thì phải sửa mục này TRƯỚC.
            */}
            <div className="rounded-md border border-jade/30 bg-jade/10 p-4">
              <p>
                <strong className="text-foreground">Ảnh bàn tay và ảnh chân dung:</strong>{' '}
                <strong className="text-foreground">KHÔNG được lưu trên máy chủ.</strong> Ảnh được
                nén ngay trên máy bạn rồi gửi kèm yêu cầu phân tích; hệ thống không ghi ảnh vào bất
                kỳ kho lưu trữ nào, nên về sau không tồn tại bản sao nào để xóa. Ảnh vẫn được truyền
                qua máy chủ để tới nhà cung cấp mô hình AI đọc ảnh — nghĩa là ảnh có rời máy bạn,
                chỉ là không được giữ lại.
              </p>
            </div>
            {/*
              KIỂM CHỨNG 04/08/2026 — đối chiếu từng dòng với backend:
              • Mentor chat: câu cũ ghi "lưu 90 ngày, sau đó tự xóa". SAI — không có
                cron nào, không có TTL nào, không có DELETE nào trên
                hieu_asia.mentor_conversations/mentor_messages ngoài user-erase.
                Chat chỉ mất khi người dùng xoá tài khoản.
              • Audit log 12 tháng: ĐÚNG, đừng "sửa" xuống 90 ngày. Có HAI nhật ký
                khác nhau — bản KV audit:user:* có expirationTtl 365 ngày và đây
                chính là bản mà /user/export trả cho người dùng (gdpr/export.ts đọc
                listAuditEntries từ KV); bản Postgres hieu_asia.audit_log là log an
                ninh nội bộ, bị purgeOldAuditLog dọn sau 90 ngày.
              • Nhật ký chi phí AI: trước đây KHÔNG hề được công bố. hieu_asia.llm_traces
                có cột user_id + reading_session_id, không cron nào xoá, và user-erase
                cũng không đụng tới. Hằng số RETENTION_DEFAULT_DAYS=90 và INTERVAL
                '90 days' trong repo chỉ là config đọc-ghi và filter của VIEW, không
                xoá dòng nào.
            */}
            <ul className="list-disc space-y-2 pl-5">
              <li>Báo cáo và metadata: lưu vô thời hạn (bạn có thể yêu cầu xóa bất cứ lúc nào).</li>
              <li>
                Conversation Mentor chat: giữ đến khi bạn xoá tài khoản. Chúng tôi không tự động xoá
                lịch sử chat theo thời hạn — bạn có thể tự xoá bất cứ lúc nào trong trang Tài khoản.
              </li>
              <li>
                Audit log truy cập dữ liệu: 12 tháng cho mục đích bảo mật (đây cũng là phần bạn tải
                được khi xuất dữ liệu). Ngoài ra có một nhật ký an ninh nội bộ được dọn sau 90 ngày.
              </li>
              <li>
                Nhật ký chi phí và vận hành mô hình AI: lưu vô thời hạn. Bản ghi này có gắn mã người
                dùng và mã phiên đọc, dùng để đối soát chi phí và phát hiện lạm dụng; nội dung câu
                hỏi/câu trả lời không nằm trong đó.
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">5. Quyền của bạn</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">5. Quyền của bạn</CardTitle>
            <CardDescription>Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <div className="rounded-md border border-gold/20 bg-card/40 p-4 text-xs text-foreground/80">
              <p className="font-semibold text-foreground">Liên hệ về dữ liệu cá nhân:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Email DPO:{' '}
                  <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                    privacy@hieu.asia
                  </a>
                </li>
                <li>Phản hồi: xác nhận trong 72h, xử lý trong tối đa 30 ngày làm việc</li>
                <li>
                  Khiếu nại: A05 (Cục An ninh mạng + phòng chống tội phạm sử dụng công nghệ cao)
                  nếu cần
                </li>
              </ul>
            </div>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Quyền truy cập:</strong> yêu cầu xem toàn bộ dữ liệu của bạn.
              </li>
              <li>
                <strong className="text-foreground">Quyền sao chép:</strong> nhận bản sao dữ liệu ở định dạng máy đọc được.
              </li>
              <li>
                <strong className="text-foreground">Quyền chỉnh sửa:</strong> sửa dữ liệu không chính xác.
              </li>
              <li>
                <strong className="text-foreground">Quyền xóa:</strong> yêu cầu xóa toàn bộ dữ liệu cá nhân của bạn.
              </li>
              <li>
                <strong className="text-foreground">Quyền rút lại sự đồng ý:</strong> rút lại consent bất cứ lúc nào.
              </li>
              <li>
                <strong className="text-foreground">Quyền phản đối xử lý:</strong> phản đối việc dùng dữ liệu cho mục đích huấn luyện AI.
              </li>
              <li>
                <strong className="text-foreground">Quyền chuyển giao dữ liệu (portability):</strong>{' '}
                tải xuống dữ liệu của bạn ở định dạng JSON máy đọc được qua{' '}
                <Link href="/account" className="text-gold-700 underline">
                  /account → Xuất dữ liệu
                </Link>
                . (Wired qua Worker endpoint <code className="font-mono text-[13px]">/user/export</code>.)
              </li>
              <li>
                <strong className="text-foreground">Quyền hạn chế xử lý (restriction):</strong>{' '}
                tắt analytics + marketing trong CMP banner hoặc{' '}
                <Link href="/account" className="text-gold-700 underline">
                  /account → Privacy
                </Link>
                . Khi tắt, mọi sự kiện đều bị PostHog opt-out và pixel marketing
                được tear down.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Cách thực hiện:</strong>{' '}
              <Link href="/account" className="text-gold-700 underline">
                Truy cập trang Tài khoản
              </Link>{' '}
              {/* Bỏ chữ "tức thì": mâu thuẫn với chính câu "tối đa 30 ngày làm việc"
                  ngay bên dưới, và với "trong vòng 30 ngày" ở /pricing + hộp thoại xoá
                  tài khoản. Thao tác bấm là tức thì, việc xoá thì không. */}
              để tải xuống bản sao dữ liệu hoặc yêu cầu xóa tài khoản. Hoặc gửi
              email tới{' '}
              <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
              . Chúng tôi xác nhận đã nhận yêu cầu trong vòng 72 giờ làm việc. Việc xử lý, xuất dữ
              liệu hoặc xoá dữ liệu được hoàn tất trong tối đa 30 ngày làm việc, trừ khi pháp luật
              yêu cầu thời hạn khác.
            </p>

            {/*
              HAI KHỐI DƯỚI ĐÂY THÊM NGÀY 04/08/2026 sau khi truy toàn bộ đường xoá ở
              backend (supabase/functions/user-erase/index.ts + worker src/gdpr/erase.ts).
              Trước đó chính sách chỉ nói "xoá vĩnh viễn", trong khi thực tế xoá không
              triệt để, và phần dữ liệu cố tình giữ lại thì KHÔNG hề được công bố —
              dù chính user-erase/index.ts:12-26 ghi rõ chính sách bắt buộc phải nêu
              trước khi người dùng đồng ý. Nếu sửa hành vi xoá ở backend thì phải cập
              nhật hai danh sách này cùng lúc.
            */}
            <div className="mt-4 rounded-md border border-gold/20 bg-card/40 p-4">
              <p className="font-semibold text-foreground">Xoá tài khoản thực sự xoá những gì</p>
              <p className="mt-2 text-xs text-foreground/80">
                Chúng tôi nói rõ thay vì hứa chung chung, để bạn quyết định dựa trên sự thật.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground/80">
                <li>
                  <strong className="text-foreground">Bị xoá hẳn:</strong> hồ sơ và dữ liệu sinh
                  trắc, các phiên đọc và báo cáo, lịch sử hội thoại Mentor, file xuất dữ liệu đã
                  tạo, và các bản ghi đăng nhập.
                </li>
                <li>
                  <strong className="text-foreground">Chỉ được làm mờ danh tính:</strong> nhật ký
                  truy cập dữ liệu và lịch sử giao dịch. Chúng tôi thay mã người dùng bằng một mã
                  ẩn danh không thể lần ngược, nhưng bản ghi vẫn tồn tại vì nghĩa vụ đối soát và
                  bảo mật.
                </li>
                <li>
                  <strong className="text-foreground">Vẫn được giữ lại:</strong> nhật ký chi phí vận
                  hành mô hình AI (có gắn mã người dùng, không chứa nội dung hội thoại), dữ liệu
                  thống kê hành vi đã gộp, và trạng thái quyền đã mở của các tính năng trả phí.
                </li>
              </ul>
              <p className="mt-2 text-xs text-foreground/80">
                Nếu bạn muốn xoá cả những mục ở hai nhóm sau, hãy gửi yêu cầu riêng tới{' '}
                <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                  privacy@hieu.asia
                </a>{' '}
                để chúng tôi xử lý thủ công.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-gold/20 bg-card/40 p-4">
              <p className="font-semibold text-foreground">
                Dữ liệu chúng tôi không thể xoá theo yêu cầu
              </p>
              <p className="mt-2 text-xs text-foreground/80">
                Một số bản ghi bắt buộc phải giữ theo quy định pháp luật, kể cả khi bạn yêu cầu xoá
                tài khoản. Chúng tôi nêu ở đây để bạn biết trước khi đồng ý:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground/80">
                <li>
                  Hồ sơ thuế và chứng từ chi trả hoa hồng cộng tác viên — giữ 10 năm theo quy định
                  về kế toán và thuế.
                </li>
                <li>
                  Nhật ký đồng ý (bạn đã đồng ý điều gì, vào lúc nào) — là bằng chứng pháp lý cho
                  chính việc xử lý dữ liệu của bạn.
                </li>
                <li>
                  Nhật ký truy cập dữ liệu cá nhân — bắt buộc theo Luật Bảo vệ dữ liệu cá nhân
                  91/2025/QH15.
                </li>
              </ul>
              <p className="mt-2 text-xs text-foreground/80">
                Các bản ghi này có thời hạn lưu riêng và sẽ được xoá tự động khi hết hạn.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="sr-only">6. Bảo mật dữ liệu</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">6. Bảo mật dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Mã hóa TLS 1.3 cho toàn bộ dữ liệu truyền tải in-transit.</li>
              {/*
                Bỏ chữ "ảnh" khỏi dòng này: kiểm 04/08/2026 cho thấy không luồng người
                dùng nào gửi ảnh lên kho, nên nói "mã hoá at-rest cho ảnh" là mô tả một
                thứ không tồn tại. Thứ THẬT SỰ nằm trong kho là bản PDF báo cáo trả phí
                (route /reading/:id/export-pdf ghi key other/<uid>/*.pdf với retention
                "permanent") và file xuất dữ liệu theo yêu cầu GDPR.
              */}
              <li>Mã hóa at-rest cho báo cáo và file xuất dữ liệu trên Cloudflare R2 / Supabase Storage.</li>
              <li>Truy cập dữ liệu nội bộ được kiểm soát bằng RBAC và audit log đầy đủ.</li>
            </ul>
            <div className="mt-4 rounded-md border border-gold/15 bg-card/40 p-4">
              <p className="font-semibold text-foreground">
                Vendor sub-processors ({SUB_PROCESSORS.length} bên đang được uỷ thác):
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Bảng cập nhật mỗi lần thay đổi nhà cung cấp. Bạn có quyền phản đối việc xử lý dữ liệu
                bởi bất kỳ vendor nào dưới đây — vui lòng email{' '}
                <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                  privacy@hieu.asia
                </a>
                .
              </p>
              <div className="mt-4 -mx-2 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Vendor</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Mục đích</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Dữ liệu gửi</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Vị trí</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Lưu trữ</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/80">
                    {SUB_PROCESSORS.map((sp) => (
                      <tr key={sp.vendor} className="border-b border-border align-top">
                        <td className="px-2 py-2.5">
                          <a
                            href={sp.policyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:text-gold"
                          >
                            {sp.vendor}
                          </a>
                        </td>
                        <td className="px-2 py-2.5">{sp.purpose}</td>
                        <td className="px-2 py-2.5">{sp.dataShared}</td>
                        <td className="px-2 py-2.5">{sp.location}</td>
                        <td className="px-2 py-2.5">{sp.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="sr-only">7. Cookies + dữ liệu thiết bị</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">7. Cookies + dữ liệu thiết bị (Wave 41)</CardTitle>
            <CardDescription>
              Bảng liệt kê đầy đủ cookies và mục đích sử dụng. Marketing cookies CHỈ tải
              sau khi bạn opt-in qua banner CMP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-2 py-2 font-mono uppercase tracking-wider">Cookie</th>
                    <th className="px-2 py-2 font-mono uppercase tracking-wider">Mục đích</th>
                    <th className="px-2 py-2 font-mono uppercase tracking-wider">TTL</th>
                    <th className="px-2 py-2 font-mono uppercase tracking-wider">Loại</th>
                    <th className="px-2 py-2 font-mono uppercase tracking-wider">Opt-out</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  {COOKIES.map((c) => (
                    <tr key={c.name} className="border-b border-border align-top">
                      <td className="px-2 py-2.5 font-mono text-[13px]">{c.name}</td>
                      <td className="px-2 py-2.5">{c.purpose}</td>
                      <td className="px-2 py-2.5">{c.retention}</td>
                      <td className="px-2 py-2.5 capitalize">{c.category}</td>
                      <td className="px-2 py-2.5">{c.optOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-md border border-gold/30 bg-gold/5 p-4 text-xs">
              <p className="font-semibold text-foreground">Quản lý đồng ý cookie</p>
              <p className="mt-1 text-foreground/80">
                Bạn có thể mở lại banner cookie và đổi tuỳ chọn bất cứ lúc nào:
              </p>
              {/* Wave 60.31 — extracted from inline <script dangerouslySetInnerHTML>.
                  Same behaviour (clear consent localStorage+cookie, dispatch
                  hieu:consent:reopen) via real React onClick + existing
                  reopenBanner() helper. Removes XSS pattern footgun. */}
              <ReopenCmpButton />
            </div>
            <div className="mt-4 rounded-md border border-jade/20 bg-jade/5 p-4 text-xs">
              <p className="font-semibold text-foreground">Sử dụng địa chỉ IP</p>
              <p className="mt-1 text-foreground/80">
                Một số sub-processor có nhận địa chỉ IP của bạn để cung cấp dịch vụ (chống
                fraud, geo-segment, retargeting). Danh sách: {IP_USING_VENDORS.join(', ')}.
                IP KHÔNG được chia sẻ với các vendor marketing server-side nếu bạn chưa
                opt-in trong CMP banner.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="sr-only">8. Thay đổi chính sách</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">8. Thay đổi chính sách</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/85">
            <p>
              Chính sách này có thể được cập nhật khi luật pháp hoặc dịch vụ thay đổi. Mọi thay đổi
              quan trọng sẽ được thông báo qua email (nếu bạn đã cung cấp) và banner trên trang chủ
              ít nhất 14 ngày trước khi có hiệu lực.
            </p>
            <p className="mt-3">
              Bản cập nhật gần nhất: <span className="text-gold-700">{LAST_UPDATED}</span>.
            </p>
          </CardContent>
        </Card>

        <h2 className="sr-only">9. Liên hệ</h2>
        <Card className="mb-6 border-gold/30">
          <CardHeader>
            <CardTitle className="text-xl">9. Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              Mọi câu hỏi, yêu cầu thực hiện quyền, hoặc khiếu nại về dữ liệu cá nhân, vui lòng liên hệ:
            </p>
            <ul className="space-y-1 pl-1">
              <li>
                Email:{' '}
                <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                  privacy@hieu.asia
                </a>
              </li>
              <li>
                Hỗ trợ:{' '}
                <a className="text-gold-700 underline" href="mailto:support@hieu.asia">
                  support@hieu.asia
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Bạn cũng có quyền khiếu nại tới Bộ Công An — Cục An ninh mạng và phòng, chống tội phạm
              sử dụng công nghệ cao (A05) nếu cho rằng quyền lợi bị xâm phạm.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gold/15 pt-8 text-center text-xs text-muted-foreground">
          <p>
            Xem thêm:{' '}
            <Link href="/terms" className="text-gold-700 underline">
              Điều khoản dịch vụ
            </Link>
          </p>
          <p>© {new Date().getFullYear()} hieu.asia · Nền tảng thấu hiểu bản thân bằng AI</p>
        </div>
      </section>
      </main>
      {/* SEO-FIX: thiếu BreadcrumbList → Google không hiện đường dẫn phân cấp. */}
      <JsonLd
        data={breadcrumb([
          { name: 'Trang chủ', url: '/' },
          { name: 'Chính sách bảo mật', url: '/privacy' },
        ])}
      />
      <SiteFooter />
    </>
  );
}
