import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = {
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản sử dụng dịch vụ hieu.asia.',
  alternates: { canonical: 'https://hieu.asia/terms' },
};

const LAST_UPDATED = '21/05/2026';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold-700">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Điều khoản dịch vụ</span>
      </header>

      <section className="container mx-auto max-w-3xl px-6 pb-20 pt-6">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Điều khoản dịch vụ
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cập nhật lần cuối: <span className="text-gold-700">{LAST_UPDATED}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            Bằng việc sử dụng hieu.asia, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ
            trước khi tiếp tục.
          </p>
        </div>

        <h2 className="sr-only">1. Định nghĩa</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">1. Định nghĩa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">"Dịch vụ"</strong>: nền tảng phân tích cá nhân AI tại
                hieu.asia và các kênh liên kết (Telegram bot, miniapp).
              </li>
              <li>
                <strong className="text-foreground">"Người dùng"</strong>: cá nhân tạo tài khoản hoặc sử
                dụng dịch vụ.
              </li>
              <li>
                <strong className="text-foreground">"Báo cáo"</strong>: nội dung phân tích cá nhân được hệ
                thống tạo ra dựa trên dữ liệu bạn cung cấp.
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">2. Phạm vi dịch vụ</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">2. Phạm vi dịch vụ</CardTitle>
            <CardDescription>hieu.asia cung cấp insight tham khảo, KHÔNG phải tư vấn chuyên môn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              Dịch vụ tổng hợp tri thức Tử Vi cổ điển, mô hình tâm lý hiện đại (MBTI và các framework
              liên quan) cùng AI vision/NLP để đưa ra góc nhìn cá nhân hóa.
            </p>
            <p className="font-semibold text-foreground">
              hieu.asia <strong className="text-gold-700">KHÔNG</strong> phải:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Dịch vụ tư vấn pháp lý.</li>
              <li>Dịch vụ tư vấn y tế hoặc chẩn đoán sức khỏe.</li>
              <li>Dịch vụ tư vấn tài chính, đầu tư, hoặc chứng khoán.</li>
              <li>Dịch vụ tâm lý trị liệu thay thế chuyên gia.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">3. DISCLAIMER quan trọng</h2>
        <Card className="mb-6 border-gold/40">
          <CardHeader>
            <CardTitle className="text-xl text-gold-700">3. DISCLAIMER quan trọng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <div className="rounded-md border border-gold/30 bg-gold/10 p-4">
              <p className="font-semibold text-foreground">
                Báo cáo hieu.asia có tính chất <strong className="text-gold-700">tham khảo</strong>, KHÔNG
                phải lời tiên tri hay phán quyết số phận.
              </p>
              <p className="mt-3">
                Mọi quyết định quan trọng về sự nghiệp, tài chính, sức khỏe, hoặc các mối quan hệ
                phải dựa trên sự cân nhắc cá nhân và tư vấn chuyên môn phù hợp. hieu.asia không chịu
                trách nhiệm về kết quả của các quyết định mà bạn đưa ra dựa trên báo cáo.
              </p>
              <p className="mt-3">
                Các framework như Tử Vi, MBTI là công cụ tự khám phá — không phải khoa học định mệnh.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="sr-only">4. Thanh toán và hoàn tiền</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">4. Thanh toán và hoàn tiền</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              Thanh toán được xử lý qua <strong className="text-foreground">SePay</strong> — đối tác thanh
              toán hợp pháp tại Việt Nam.
            </p>
            <p className="font-semibold text-foreground">Chính sách hoàn tiền (Refund Policy):</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Hoàn tiền <strong className="text-gold-700">100% trong vòng 24 giờ</strong> nếu báo
                cáo chưa được tạo (hệ thống chưa gọi AI inference).
              </li>
              <li>
                Sau khi báo cáo đã được tạo, chúng tôi vẫn xem xét hoàn tiền trong{' '}
                <strong className="text-gold-700">14 ngày</strong> nếu có lỗi kỹ thuật, nội dung
                không được tạo, hoặc trải nghiệm không đúng mô tả.
              </li>
              <li>
                Mỗi yêu cầu được phản hồi trong vòng <strong className="text-gold-700">3 ngày làm việc</strong>.
              </li>
              <li>
                Yêu cầu hoàn tiền vui lòng gửi tới{' '}
                <a className="text-gold-700 underline" href="mailto:support@hieu.asia">
                  support@hieu.asia
                </a>{' '}
                kèm mã giao dịch.
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">5. Tài khoản người dùng</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">5. Tài khoản người dùng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập.</li>
              <li>Một tài khoản chỉ phục vụ một cá nhân — không chia sẻ.</li>
              <li>Thông báo ngay cho hieu.asia nếu nghi ngờ tài khoản bị truy cập trái phép.</li>
              <li>hieu.asia có quyền tạm khóa tài khoản vi phạm điều khoản mà không hoàn tiền.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">6. Hành vi bị cấm</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">6. Hành vi bị cấm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/85">
            <ul className="list-disc space-y-2 pl-5">
              <li>Spam, gửi nội dung khiêu khích hoặc lừa đảo qua Mentor chat.</li>
              <li>Scrape, crawl, hoặc trích xuất dữ liệu hàng loạt khỏi dịch vụ.</li>
              <li>Reverse-engineer, decompile, hoặc tìm cách truy cập trái phép vào hệ thống.</li>
              <li>Sử dụng dịch vụ cho mục đích bất hợp pháp tại Việt Nam.</li>
              <li>Tạo nhiều tài khoản để khai thác chương trình khuyến mãi.</li>
              <li>Mạo danh người khác để tạo báo cáo.</li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">7. Giới hạn trách nhiệm</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">7. Giới hạn trách nhiệm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              Trong phạm vi pháp luật cho phép, hieu.asia không chịu trách nhiệm về:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Thiệt hại gián tiếp, hệ quả, hoặc mất cơ hội phát sinh từ việc sử dụng dịch vụ.</li>
              <li>Quyết định cá nhân hoặc kinh doanh dựa trên nội dung báo cáo.</li>
              <li>Gián đoạn dịch vụ do force majeure (thiên tai, sự cố nhà cung cấp upstream).</li>
              <li>
                Tổng trách nhiệm bồi thường tối đa không vượt quá số tiền bạn đã thanh toán cho hieu.asia
                trong 12 tháng gần nhất.
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="sr-only">8. Luật áp dụng</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">8. Luật áp dụng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/85">
            <p>
              Điều khoản này được điều chỉnh theo pháp luật{' '}
              <strong className="text-foreground">nước Cộng hoà Xã hội Chủ nghĩa Việt Nam</strong>. Tranh
              chấp (nếu có) sẽ được giải quyết tại Toà án có thẩm quyền tại Việt Nam.
            </p>
          </CardContent>
        </Card>

        <h2 className="sr-only">9. Cập nhật điều khoản</h2>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">9. Cập nhật điều khoản</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/85">
            <p>
              hieu.asia có thể cập nhật điều khoản theo thời gian. Phiên bản hiện tại được cập nhật
              lần cuối ngày <span className="text-gold-700">{LAST_UPDATED}</span>. Việc tiếp tục sử dụng
              dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận phiên bản
              mới.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gold/15 pt-8 text-center text-xs text-muted-foreground">
          <p>
            Xem thêm:{' '}
            <Link href="/privacy" className="text-gold-700 underline">
              Chính sách bảo mật
            </Link>
          </p>
          <p>© {new Date().getFullYear()} hieu.asia · Premium AI insight platform</p>
        </div>
      </section>
    </main>
  );
}
