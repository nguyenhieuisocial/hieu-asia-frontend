import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <span className="font-heading text-xl font-semibold text-gold">hieu.asia</span>
        <ThemeToggle />
      </header>

      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
            Cẩm Nang Cuộc Đời <span className="text-gold">AI</span>
          </h1>
          <p className="mt-6 text-lg text-cream/80 sm:text-xl">
            Phân tích tính cách, vận hạn, sự nghiệp và chiến lược hành động cá nhân hóa —
            không định mệnh hóa, chỉ định hướng hành động.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild={false}>
              <Link href="/onboarding">Bắt đầu luận giải</Link>
            </Button>
            <Button size="lg" variant="outline" asChild={false}>
              <Link href="/dashboard">Xem demo báo cáo</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '1', title: 'Nhập ngày sinh', desc: 'Thông tin cơ bản và bối cảnh hiện tại.' },
            { step: '2', title: 'Chụp ảnh tay', desc: 'Hướng dẫn trực quan, không cần ứng dụng riêng.' },
            { step: '3', title: 'Khảo sát ngắn', desc: '12–20 câu để hiểu cách bạn quyết định.' },
            { step: '4', title: 'Báo cáo + Mentor', desc: '9 góc nhìn + chat cố vấn AI 24/7.' },
          ].map((it) => (
            <Card key={it.step}>
              <CardHeader>
                <span className="font-mono text-sm text-gold">Bước {it.step}</span>
                <CardTitle>{it.title}</CardTitle>
                <CardDescription>{it.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Cam kết</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-cream/80 sm:grid-cols-2">
                <li>· Không định mệnh hóa — chỉ tham khảo và định hướng hành động.</li>
                <li>· Dữ liệu bảo mật, mã hoá khi lưu trữ.</li>
                <li>· Bạn có thể xoá toàn bộ dữ liệu cá nhân bất cứ lúc nào.</li>
                <li>· Báo cáo có thể tải về dạng PDF.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-10 text-center text-sm text-cream/50">
        © {new Date().getFullYear()} hieu.asia · Premium AI insight platform
      </footer>
    </main>
  );
}
