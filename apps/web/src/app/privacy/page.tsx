import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ReopenCmpButton } from '@/components/cmp/ReopenCmpButton';

export const metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Cam kết bảo vệ dữ liệu cá nhân tại hieu.asia, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
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
    purpose: 'Cờ "đã đăng nhập" cho SSR partner gate (chỉ giá trị "1", KHÔNG chứa token/JWT)',
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
    purpose: 'Light/dark preference',
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold-700">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Chính sách bảo mật</span>
      </header>

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
            tuân thủ <strong className="text-gold-700">Nghị định 13/2023/NĐ-CP</strong> của Chính phủ Việt
            Nam về bảo vệ dữ liệu cá nhân.
          </p>
        </div>

        <h2 className="sr-only">1. Người thu thập dữ liệu</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">1. Người thu thập dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              <strong className="text-foreground">hieu.asia</strong> — nền tảng AI insight cá nhân hóa.
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
            <div className="rounded-md border border-jade/30 bg-jade/10 p-4">
              <p>
                <strong className="text-foreground">Ảnh bàn tay và ảnh chân dung:</strong>{' '}
                <strong className="text-foreground">TỰ ĐỘNG XÓA SAU 7 NGÀY</strong> kể từ khi báo cáo
                được xử lý xong. Sau khi vision AI trích xuất đặc điểm, ảnh gốc sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-5">
              <li>Báo cáo và metadata: lưu vô thời hạn (bạn có thể yêu cầu xóa bất cứ lúc nào).</li>
              <li>Conversation Mentor chat: lưu 90 ngày, sau đó tự xóa.</li>
              <li>Audit log truy cập dữ liệu: lưu 12 tháng cho mục đích bảo mật.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">5. Quyền của bạn</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">5. Quyền của bạn</CardTitle>
            <CardDescription>Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</CardDescription>
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
                . (Wired qua Worker endpoint <code className="font-mono text-[11px]">/user/export</code>.)
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
              để tải xuống bản sao dữ liệu hoặc xóa tài khoản tức thì. Hoặc gửi
              email tới{' '}
              <a className="text-gold-700 underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
              . Chúng tôi xác nhận đã nhận yêu cầu trong vòng 72 giờ làm việc. Việc xử lý, xuất dữ
              liệu hoặc xoá dữ liệu được hoàn tất trong tối đa 30 ngày làm việc, trừ khi pháp luật
              yêu cầu thời hạn khác.
            </p>
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
              <li>Mã hóa at-rest cho ảnh và báo cáo trên Cloudflare R2 / Supabase Storage.</li>
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
                      <td className="px-2 py-2.5 font-mono text-[11px]">{c.name}</td>
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
          <p>© {new Date().getFullYear()} hieu.asia · Premium AI insight platform</p>
        </div>
      </section>
    </main>
  );
}
