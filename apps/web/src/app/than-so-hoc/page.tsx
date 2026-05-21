'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';

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
    const params = new URLSearchParams({ full_name: fullName.trim(), birth_date: birthDate });
    router.push(`/than-so-hoc/result?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Thần Số Học</h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          Phân tích con số định mệnh theo phương pháp Pythagoras — đường đời, vận mệnh,
          linh hồn, tính cách, chu kỳ đỉnh cao và thử thách trong cuộc đời bạn.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Nhập thông tin của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Họ và tên đầy đủ</Label>
              <Input
                id="full_name"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="off"
              />
              <p className="text-xs text-foreground/60">
                Dùng tên khai sinh đầy đủ để có kết quả chính xác nhất.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birth_date">Ngày sinh</Label>
              <Input
                id="birth_date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Đang tính...' : 'Phân tích thần số học'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-3">
        <FeatureCard title="Đường đời" body="Sứ mệnh và con đường lớn nhất của cuộc đời bạn." />
        <FeatureCard title="Vận mệnh" body="Tài năng và công việc phù hợp dựa trên tên đầy đủ." />
        <FeatureCard title="Linh hồn" body="Khao khát sâu thẳm và động lực bên trong." />
        <FeatureCard title="Tính cách" body="Cách người khác cảm nhận về bạn." />
        <FeatureCard title="Năm cá nhân 2026" body="Chu kỳ năng lượng năm nay dành cho bạn." />
        <FeatureCard title="Chu kỳ đỉnh cao" body="4 đỉnh cao và 4 thử thách trong cuộc đời." />
      </section>

      <div className="text-center">
        <Link href="/" className="text-sm text-gold underline-offset-4 hover:underline">
          ← Quay về trang chủ
        </Link>
      </div>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-foreground/70">{body}</div>
    </div>
  );
}
