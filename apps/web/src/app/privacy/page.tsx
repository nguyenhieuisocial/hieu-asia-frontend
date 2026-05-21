import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = {
  title: 'Chính sách bảo mật — hieu.asia',
  description:
    'Cam kết bảo vệ dữ liệu cá nhân tại hieu.asia, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
};

const LAST_UPDATED = '21/05/2026';

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
    purpose: 'Product analytics (ẩn danh)',
    dataShared: 'Sự kiện UI, không kèm PII',
    location: 'EU (eu.posthog.com)',
    retention: '12 tháng',
    policyUrl: 'https://posthog.com/privacy',
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
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/70">Chính sách bảo mật</span>
      </header>

      <section className="container mx-auto max-w-3xl px-6 pb-20 pt-6">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
            Chính sách bảo mật dữ liệu cá nhân
          </h1>
          <p className="mt-3 text-sm text-cream/70">
            Cập nhật lần cuối: <span className="text-gold">{LAST_UPDATED}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            Chính sách này mô tả cách hieu.asia thu thập, lưu trữ và sử dụng dữ liệu cá nhân của bạn,
            tuân thủ <strong className="text-gold">Nghị định 13/2023/NĐ-CP</strong> của Chính phủ Việt
            Nam về bảo vệ dữ liệu cá nhân.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">1. Người thu thập dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-cream/85">
            <p>
              <strong className="text-cream">hieu.asia</strong> — nền tảng AI insight cá nhân hóa.
            </p>
            <p>
              Mọi câu hỏi về dữ liệu, vui lòng liên hệ:{' '}
              <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">2. Loại dữ liệu chúng tôi thu thập</CardTitle>
            <CardDescription>Chỉ thu thập dữ liệu cần thiết để tạo báo cáo cho bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-cream/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Họ tên (hoặc biệt danh), ngày — tháng — năm — giờ sinh, nơi sinh.</li>
              <li>Ảnh lòng bàn tay; ảnh chân dung (tuỳ chọn, có thể bỏ qua).</li>
              <li>Câu trả lời khảo sát MBTI và 3 câu hỏi bối cảnh nghề nghiệp.</li>
              <li>Telegram User ID nếu bạn đăng nhập qua bot Telegram.</li>
              <li>Lịch sử cuộc trò chuyện với Mentor AI.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">3. Mục đích sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-cream/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Tạo báo cáo phân tích cá nhân (Tử Vi + MBTI + tâm lý) dành riêng cho bạn.</li>
              <li>
                Cải thiện chất lượng AI prompts <em>sau khi dữ liệu đã được ẩn danh hóa hoàn toàn</em>.
              </li>
              <li>
                <strong className="text-gold">Chúng tôi KHÔNG bán dữ liệu cá nhân cho bất kỳ bên thứ ba nào.</strong>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">4. Thời gian lưu trữ</CardTitle>
            <CardDescription>Chúng tôi xóa dữ liệu nhạy cảm sớm nhất có thể.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-cream/85">
            <div className="rounded-md border border-jade/30 bg-jade/10 p-4">
              <p>
                <strong className="text-jade">Ảnh bàn tay và ảnh chân dung:</strong>{' '}
                <strong className="text-cream">TỰ ĐỘNG XÓA SAU 7 NGÀY</strong> kể từ khi báo cáo
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">5. Quyền của bạn</CardTitle>
            <CardDescription>Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-cream/85">
            <div className="rounded-md border border-gold/20 bg-ink/40 p-4 text-xs text-cream/80">
              <p className="font-semibold text-cream">Liên hệ về dữ liệu cá nhân:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Email DPO:{' '}
                  <a className="text-gold underline" href="mailto:privacy@hieu.asia">
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
                <strong className="text-cream">Quyền truy cập:</strong> yêu cầu xem toàn bộ dữ liệu của bạn.
              </li>
              <li>
                <strong className="text-cream">Quyền sao chép:</strong> nhận bản sao dữ liệu ở định dạng máy đọc được.
              </li>
              <li>
                <strong className="text-cream">Quyền chỉnh sửa:</strong> sửa dữ liệu không chính xác.
              </li>
              <li>
                <strong className="text-cream">Quyền xóa:</strong> yêu cầu xóa toàn bộ dữ liệu cá nhân của bạn.
              </li>
              <li>
                <strong className="text-cream">Quyền rút lại sự đồng ý:</strong> rút lại consent bất cứ lúc nào.
              </li>
              <li>
                <strong className="text-cream">Quyền phản đối xử lý:</strong> phản đối việc dùng dữ liệu cho mục đích huấn luyện AI.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Cách thực hiện:</strong>{' '}
              <Link href="/account" className="text-gold underline">
                Truy cập trang Tài khoản
              </Link>{' '}
              để tải xuống bản sao dữ liệu hoặc xóa tài khoản tức thì. Hoặc gửi
              email tới{' '}
              <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
              . Chúng tôi xác nhận đã nhận yêu cầu trong vòng 72 giờ làm việc. Việc xử lý, xuất dữ
              liệu hoặc xoá dữ liệu được hoàn tất trong tối đa 30 ngày làm việc, trừ khi pháp luật
              yêu cầu thời hạn khác.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">6. Bảo mật dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-cream/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Mã hóa TLS 1.3 cho toàn bộ dữ liệu truyền tải in-transit.</li>
              <li>Mã hóa at-rest cho ảnh và báo cáo trên Cloudflare R2 / Supabase Storage.</li>
              <li>Truy cập dữ liệu nội bộ được kiểm soát bằng RBAC và audit log đầy đủ.</li>
            </ul>
            <div className="mt-4 rounded-md border border-gold/15 bg-ink/40 p-4">
              <p className="font-semibold text-cream">
                Vendor sub-processors ({SUB_PROCESSORS.length} bên đang được uỷ thác):
              </p>
              <p className="mt-1 text-xs text-cream/65">
                Bảng cập nhật mỗi lần thay đổi nhà cung cấp. Bạn có quyền phản đối việc xử lý dữ liệu
                bởi bất kỳ vendor nào dưới đây — vui lòng email{' '}
                <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                  privacy@hieu.asia
                </a>
                .
              </p>
              <div className="mt-4 -mx-2 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-cream/15 text-cream/65">
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Vendor</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Mục đích</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Dữ liệu gửi</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Vị trí</th>
                      <th className="px-2 py-2 font-mono uppercase tracking-wider">Lưu trữ</th>
                    </tr>
                  </thead>
                  <tbody className="text-cream/80">
                    {SUB_PROCESSORS.map((sp) => (
                      <tr key={sp.vendor} className="border-b border-cream/8 align-top">
                        <td className="px-2 py-2.5">
                          <a
                            href={sp.policyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-cream hover:text-gold"
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">7. Cookie và tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-cream/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Chỉ sử dụng <strong className="text-cream">functional cookies</strong> (session, locale,
                tùy chọn dark mode).
              </li>
              <li>
                <strong className="text-gold">KHÔNG sử dụng advertising cookies</strong> hay tracking
                cookies của bên thứ ba.
              </li>
              <li>
                Analytics tuỳ chọn: Cloudflare Web Analytics (hoàn toàn ẩn danh, không thu IP/fingerprint).
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">8. Thay đổi chính sách</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-cream/85">
            <p>
              Chính sách này có thể được cập nhật khi luật pháp hoặc dịch vụ thay đổi. Mọi thay đổi
              quan trọng sẽ được thông báo qua email (nếu bạn đã cung cấp) và banner trên trang chủ
              ít nhất 14 ngày trước khi có hiệu lực.
            </p>
            <p className="mt-3">
              Bản cập nhật gần nhất: <span className="text-gold">{LAST_UPDATED}</span>.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-gold/30">
          <CardHeader>
            <CardTitle className="text-xl">9. Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-cream/85">
            <p>
              Mọi câu hỏi, yêu cầu thực hiện quyền, hoặc khiếu nại về dữ liệu cá nhân, vui lòng liên hệ:
            </p>
            <ul className="space-y-1 pl-1">
              <li>
                Email:{' '}
                <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                  privacy@hieu.asia
                </a>
              </li>
              <li>
                Hỗ trợ:{' '}
                <a className="text-gold underline" href="mailto:support@hieu.asia">
                  support@hieu.asia
                </a>
              </li>
            </ul>
            <p className="text-xs text-cream/55">
              Bạn cũng có quyền khiếu nại tới Bộ Công An — Cục An ninh mạng và phòng, chống tội phạm
              sử dụng công nghệ cao (A05) nếu cho rằng quyền lợi bị xâm phạm.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gold/15 pt-8 text-center text-xs text-cream/55">
          <p>
            Xem thêm:{' '}
            <Link href="/terms" className="text-gold underline">
              Điều khoản dịch vụ
            </Link>
          </p>
          <p>© {new Date().getFullYear()} hieu.asia · Premium AI insight platform</p>
        </div>
      </section>
    </main>
  );
}
