import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ZaloHeader } from '../components/zalo-header';

const LAST_UPDATED = '21/05/2026';
const FULL_POLICY_URL = 'https://hieu.asia/privacy';

const KEY_POINTS: Array<{ title: string; body: string }> = [
  {
    title: 'Tuân thủ Nghị định 13/2023/NĐ-CP',
    body: 'Mọi xử lý dữ liệu cá nhân tại hieu.asia tuân thủ luật bảo vệ dữ liệu cá nhân Việt Nam — mã hoá AES-256, có nhật ký audit, quyền rút lại bất cứ lúc nào.',
  },
  {
    title: 'LLM không lưu dữ liệu (zero-retention)',
    body: 'Khi gửi prompt tới Anthropic Claude và Google Gemini Vision, chúng tôi dùng API zero-retention: nhà cung cấp KHÔNG lưu nội dung sau khi trả kết quả. OpenAI dùng cho fallback có lưu 30 ngày theo enterprise API.',
  },
  {
    title: 'Dữ liệu Zalo Mini App',
    body: 'Chúng tôi chỉ yêu cầu `scope.userInfo` để định danh phiên. Không đọc danh bạ, không đọc tin nhắn Zalo, không truy cập vị trí trừ khi bạn cho phép rõ ràng.',
  },
  {
    title: 'Quyền của bạn',
    body: 'Xem, xuất hoặc xoá toàn bộ dữ liệu cá nhân của bạn bất cứ lúc nào trong Bảng điều khiển → Quyền riêng tư.',
  },
];

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink-radial pb-10">
      <ZaloHeader title="Chính sách bảo mật" backTo="/" />
      <section className="space-y-4 px-4 pt-5">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt</CardTitle>
            <CardDescription>Cập nhật {LAST_UPDATED}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {KEY_POINTS.map((p) => (
              <div key={p.title}>
                <p className="text-sm font-semibold text-gold">{p.title}</p>
                <p className="mt-1 text-sm text-cream/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-cream/80">
              Xem bản đầy đủ (sub-processor, retention, DPO contact) tại{' '}
              <a
                href={FULL_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                hieu.asia/privacy
              </a>
              .
            </p>
            <p className="mt-3 text-[11px] text-cream/55">
              Liên hệ DPO: privacy@hieu.asia
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
