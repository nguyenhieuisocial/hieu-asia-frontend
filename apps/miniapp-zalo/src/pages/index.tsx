import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { Sparkles, ScanLine, ClipboardList, CalendarDays } from 'lucide-react';

const STEPS = [
  { icon: CalendarDays, label: 'Nhập ngày sinh' },
  { icon: ScanLine, label: 'Chụp ảnh tay' },
  { icon: ClipboardList, label: 'Khảo sát ngắn' },
  { icon: Sparkles, label: 'Báo cáo + Mentor' },
];

export function WelcomePage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-ink-radial pb-10">
      <div className="zalo-safe-top px-5 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">
          Zalo Mini App
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-cream">
          Cẩm Nang Cuộc Đời{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="mt-3 text-sm text-cream/75">
          Phân tích tính cách, vận hạn và chiến lược hành động cá nhân hóa từ Tử Vi, tâm lý và
          Vision AI.
        </p>
      </div>

      <section className="mt-8 px-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-cream/40">
          Bốn bước
        </p>
        <div className="grid grid-cols-2 gap-3">
          {STEPS.map(({ icon: Icon, label }) => (
            <Card key={label} className="border-gold/15">
              <CardContent className="flex flex-col gap-2 pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold/25 bg-gold/5">
                  <Icon className="h-4 w-4 text-gold" />
                </span>
                <p className="text-sm font-medium text-cream/90">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <Button size="lg" className="w-full" onClick={() => navigate('/consent')}>
          Bắt đầu luận giải
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="mt-3 w-full"
          onClick={() => navigate('/dashboard')}
        >
          Xem báo cáo đã có
        </Button>
        <p className="mt-4 text-center text-[11px] text-cream/45">
          Không định mệnh hóa · Dữ liệu được mã hoá · Kết quả tham khảo
        </p>
        <p className="mt-2 text-center text-[11px] text-cream/45">
          <button
            type="button"
            onClick={() => navigate('/privacy')}
            className="underline-offset-4 hover:text-gold hover:underline"
          >
            Chính sách bảo mật
          </button>
        </p>
      </section>
    </main>
  );
}
