import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = {
  title: 'Chính sách bảo mật — hieu.asia',
  description:
    'Cam kết bảo vệ dữ liệu cá nhân tại hieu.asia, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
};

const LAST_UPDATED = '21/05/2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/50">Chính sách bảo mật</span>
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
              </a>{' '}
              — chúng tôi sẽ phản hồi trong 30 ngày làm việc.
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
              <p className="font-semibold text-cream">Vendor sub-processors:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-cream/75">
                <li>Anthropic (Claude) — phân tích tâm lý, soạn báo cáo.</li>
                <li>OpenAI (GPT) — logic và alignment.</li>
                <li>Google (Gemini) — vision AI (ảnh bàn tay).</li>
                <li>Cloudflare — hosting, R2 storage, Workers AI fallback.</li>
                <li>Vercel — frontend hosting.</li>
                <li>Supabase — database, audit log, Edge Functions.</li>
                <li>SePay — xử lý thanh toán.</li>
              </ul>
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
