'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';

const FEATURES: { title: string; body: string; icon: string }[] = [
  { title: 'Đường đời', body: 'Con đường lớn và thiên hướng phát triển trong cuộc đời bạn.', icon: '🛤️' },
  { title: 'Số biểu đạt', body: 'Tài năng và xu hướng nghề nghiệp dựa trên tên đầy đủ.', icon: '⚡' },
  { title: 'Linh hồn', body: 'Khao khát sâu thẳm và động lực bên trong.', icon: '✨' },
  { title: 'Tính cách', body: 'Cách người khác cảm nhận về bạn.', icon: '👤' },
  { title: 'Năm cá nhân 2026', body: 'Chu kỳ năng lượng năm nay dành cho bạn.', icon: '📅' },
  { title: 'Chu kỳ đỉnh cao', body: '4 đỉnh cao và 4 thử thách trong cuộc đời.', icon: '⛰️' },
];

export default function ThanSoHocLandingPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !birthDate) {
      setError('Vui lòng nhập đầy đủ họ tên và ngày sinh.');
      return;
    }
    setSubmitting(true);
    track('cta_clicked', { cta_id: 'than-so-hoc-submit', page: '/than-so-hoc' });
    const params = new URLSearchParams({ full_name: fullName.trim(), birth_date: birthDate });
    router.push(`/than-so-hoc/result?${params.toString()}`);
  };

  return (
    <>
    <ToolPageShell
      eyebrow="Numerology · Pythagoras"
      icon={<span aria-hidden="true">🔢</span>}
      title={
        <>
          Thần <GoldAccent>Số Học</GoldAccent>
        </>
      }
      description="Phân tích con số chủ đạo theo phương pháp Pythagoras — đường đời, thiên hướng, linh hồn, tính cách, chu kỳ đỉnh cao và thử thách trong cuộc đời bạn."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thần Số Học' },
      ]}
    >
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Nhập thông tin của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-foreground/85">
                    Họ và tên đầy đủ
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-card/60"
                  />
                  <p className="text-xs text-muted-foreground">
                    Dùng tên khai sinh đầy đủ để có kết quả chính xác nhất.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="birth_date" className="text-foreground/85">
                    Ngày sinh
                  </Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="bg-card/60"
                  />
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                  >
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Đang tính...' : 'Phân tích thần số học →'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-2">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Bạn sẽ nhận được
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-3 transition-colors hover:border-gold/30"
              >
                <span aria-hidden className="text-xl">
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{f.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </ToolPageShell>
    <StickyMobileCta trackId="than-so-hoc" />
    </>
  );
}
