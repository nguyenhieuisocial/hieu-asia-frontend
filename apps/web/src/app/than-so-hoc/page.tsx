'use client';

import * as React from 'react';
import Link from 'next/link';
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
  { title: 'Năm cá nhân hiện tại', body: 'Chu kỳ năng lượng năm nay dành cho bạn.', icon: '📅' },
  { title: 'Chu kỳ đỉnh cao', body: '4 đỉnh cao và 4 thử thách trong cuộc đời.', icon: '⛰️' },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Thần số học là gì?',
    a: 'Thần số học là hệ thống diễn giải ý nghĩa các con số rút ra từ ngày sinh và họ tên. Truyền thống này gắn với trường phái Pythagoras (Hy Lạp cổ đại) và được hệ thống hoá thành dạng phổ biến hiện nay vào đầu thế kỷ 20. hieu.asia dùng nó như một lăng kính chiêm nghiệm — không phán định số mệnh.',
  },
  {
    q: 'Số chủ đạo (đường đời) được tính thế nào?',
    a: 'Cộng dồn toàn bộ chữ số trong ngày sinh dương lịch rồi rút gọn về một chữ số từ 1 đến 9. Ví dụ 28/12/1995 → 2+8+1+2+1+9+9+5 = 37 → 3+7 = 10 → 1. Riêng 11, 22 và 33 được giữ nguyên vì là "số bậc thầy". Phần tính toán này là số học thuần tuý, chạy bằng thuật toán cố định.',
  },
  {
    q: 'Số bậc thầy 11, 22 và 33 có gì đặc biệt?',
    a: 'Trong quy ước thần số học, 11, 22 và 33 không rút gọn tiếp vì được xem là mang chủ đề "khuếch đại" — 11 thiên về trực giác và truyền cảm hứng, 22 thiên về kiến tạo việc lớn, 33 thiên về chăm sóc và dẫn dắt. Hãy đọc chúng như một chủ đề để chiêm nghiệm, kèm áp lực riêng của nó, thay vì một danh hiệu.',
  },
  {
    q: 'Vì sao cần cả họ tên lẫn ngày sinh?',
    a: 'Hai nguồn cho hai nhóm chỉ số khác nhau: ngày sinh cho số đường đời và các chu kỳ (năm cá nhân, đỉnh cao, thử thách); họ tên — quy đổi từng chữ cái sang số 1–9 theo bảng Pythagoras — cho số biểu đạt, linh hồn (nguyên âm) và tính cách (phụ âm). Thiếu một trong hai thì bức tranh không đủ.',
  },
  {
    q: 'Thần số học có phải khoa học không?',
    a: 'Không — đây không phải khoa học thực nghiệm và không có bằng chứng tiên đoán tương lai. Giá trị thực tế của nó là bộ khung gợi mở để bạn tự soi lại mình. hieu.asia nói thẳng điều này thay vì thổi phồng; nếu bạn cần mô hình có nền nghiên cứu tâm lý, hãy thử Big Five.',
  },
  {
    q: 'Thần số học khác gì Tử Vi hay MBTI?',
    a: 'Thần số học nhẹ và nhanh: chỉ cần ngày sinh + họ tên, không cần giờ sinh. Tử Vi Đẩu Số cần cả giờ sinh và cho lá số 12 cung chi tiết hơn nhiều. MBTI/Big Five là trắc nghiệm tâm lý — kết quả đến từ câu trả lời của bạn. Xem nhiều lăng kính rồi đối chiếu là cách dùng hay nhất.',
  },
];

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
    />
    <ToolPageShell
      eyebrow="Numerology · Pythagoras"
        relatedSlug="/than-so-hoc"
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
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href="/than-so-hoc/y-nghia"
          className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
        >
          <span className="text-foreground/85">🔢 <b className="text-foreground">Ý nghĩa 12 số chủ đạo</b> — tra cứu khuynh hướng, điểm mạnh &amp; bài học từng số</span>
          <span className="shrink-0 text-gold">Mở →</span>
        </Link>
        <Link
          href="/than-so-hoc/cac-loai-so"
          className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-card/40 px-4 py-3 text-sm transition-colors hover:border-gold/40 hover:bg-gold/5"
        >
          <span className="text-foreground/85">🧮 <b className="text-foreground">Các loại số khác</b> — số vận mệnh, linh hồn, nhân cách, ngày sinh là gì</span>
          <span className="shrink-0 text-gold">Mở →</span>
        </Link>
      </div>
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
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
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

      <section
        aria-labelledby="tsh-about-heading"
        className="mt-12 border-t border-border pt-10"
      >
        <h2
          id="tsh-about-heading"
          className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
        >
          Thần số học hoạt động thế nào?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
          <p>
            Mọi chỉ số đều rút ra từ <strong className="text-foreground">hai nguồn
            dữ liệu</strong> bạn nhập: ngày sinh được cộng dồn và rút gọn về 1–9
            (giữ nguyên 11, 22, 33) để ra <strong className="text-foreground">số đường
            đời</strong> và các chu kỳ; họ tên được quy đổi từng chữ cái sang số
            theo bảng Pythagoras để ra số biểu đạt, linh hồn (nguyên âm) và tính
            cách (phụ âm). Phần tính toán này là số học thuần tuý — chạy bằng
            thuật toán cố định, ai tính cũng ra đúng một kết quả.
          </p>
          <p>
            Phần <strong className="text-foreground">diễn giải ý nghĩa</strong> là
            truyền thống chiêm nghiệm, không phải khoa học thực nghiệm — hieu.asia
            nói thẳng điều này. Cách dùng có ích nhất: đọc như một bộ câu hỏi về
            chính mình, đối chiếu với trải nghiệm thật, và so với các lăng kính
            khác (Tử Vi, Big Five) thay vì tin một chiều.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="tsh-faq-heading"
        className="mt-10"
      >
        <h2
          id="tsh-faq-heading"
          className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
        >
          Câu hỏi thường gặp
        </h2>
        <dl className="mt-4 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-border bg-card/40 px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </dl>
      </section>
    </ToolPageShell>
    <StickyMobileCta trackId="than-so-hoc" />
    </>
  );
}
