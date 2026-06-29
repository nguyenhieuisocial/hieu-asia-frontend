'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Skeleton,
} from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface CanXuongResult {
  weight_year: string;
  weight_month: string;
  weight_day: string;
  weight_hour: string;
  total_weight: string;
  total_value: number;
  fortune_level: 'Tốt' | 'Khá' | 'Trung bình' | 'Xấu';
  poem: string;
  interpretation: string;
  input: {
    birth_date: string;
    birth_hour: number;
    lunar_year: number;
    lunar_month: number;
    lunar_day: number;
    can_chi_year: string;
    chi_hour: string;
  };
}

const LEVEL_STYLE: Record<
  CanXuongResult['fortune_level'],
  { tag: string; ring: string; glow: string }
> = {
  Tốt: {
    tag: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    ring: 'border-emerald-500/30',
    glow: 'from-emerald-500/10',
  },
  Khá: {
    tag: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    ring: 'border-sky-500/30',
    glow: 'from-sky-500/10',
  },
  'Trung bình': {
    tag: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    ring: 'border-amber-500/30',
    glow: 'from-amber-500/10',
  },
  Xấu: {
    tag: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    ring: 'border-rose-500/30',
    glow: 'from-rose-500/10',
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Cân xương tính số là gì?',
    a: 'Là phép luận số dân gian: gán cho năm, tháng, ngày và giờ sinh mỗi thành phần một "trọng lượng xương" (tính bằng lạng, chỉ), cộng lại thành tổng rồi tra bài thơ luận giải ứng với tổng đó. Tương truyền phép này gắn với Viên Thiên Cang đời Đường, lưu truyền trong dân gian với nhiều dị bản.',
  },
  {
    q: 'Cách tính cụ thể thế nào?',
    a: 'Ngày giờ sinh của bạn được đổi sang lịch âm: năm tính theo can chi, tháng và ngày theo lịch âm, giờ theo 12 canh giờ. Mỗi thành phần tra ra một số lạng cố định theo bảng cổ truyền; cộng bốn thành phần được tổng (ví dụ 4 lạng 3). Công cụ đổi lịch và tra bảng tự động — ai nhập cùng dữ liệu cũng ra cùng kết quả.',
  },
  {
    q: 'Xương càng nặng là số càng sướng?',
    a: 'Quan niệm cũ xếp tổng nặng cân là "số an nhàn" — nhưng đừng đọc máy móc. Bài thơ luận giải dùng ngôn ngữ và chuẩn mực xã hội thời xưa (công danh, điền sản…), phản ánh giá trị thời đó chứ không phải thước đo cuộc sống hiện đại. hieu.asia giữ nguyên bản thơ để bạn tham khảo trung thực, kèm lời giải thích — không hù doạ ai "nhẹ cân".',
  },
  {
    q: 'Vì sao hai người cùng tổng lạng mà cuộc đời khác nhau?',
    a: 'Vì phép cân xương nén cả ngày giờ sinh về MỘT con số tổng — độ phân giải rất thấp (chỉ vài chục mức cho tất cả mọi người). Đây là lý do nên xem nó như một lát cắt tham khảo vui và nhanh, còn muốn phân tích cá nhân thật sự thì cần Tử Vi hoặc Bát Tự.',
  },
  {
    q: 'Cân xương khác gì Tử Vi, Bát Tự?',
    a: 'Cân xương là phép tra cứu nhanh ra một con số tổng kèm bài thơ — đơn giản, một chiều. Tử Vi lập lá số 12 cung với hơn trăm sao; Bát Tự đọc Nhật Chủ (chính bạn) và tương quan ngũ hành của tám chữ can chi để thấy thiên hướng và thời điểm — cả hai đa chiều và cá nhân hơn nhiều. Thử cân xương cho biết, rồi đào sâu bằng lá số là cách dùng hợp lý.',
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

export default function CanXuongPage() {
  const [birthDate, setBirthDate] = React.useState('');
  const [birthHour, setBirthHour] = React.useState('12');
  const [gender, setGender] = React.useState('M');
  const [result, setResult] = React.useState<CanXuongResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!birthDate) {
      setError('Vui lòng nhập ngày sinh.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/can-xuong`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_hour: Number(birthHour),
          gender,
        }),
      });
      const parsed = await safeJson<{ ok: boolean; result?: CanXuongResult; error?: string }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const json = parsed.data;
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tính được kết quả');
      setResult(json.result);
      track('tool_used', { tool: 'can-xuong', result: 'ok' });
    } catch (e) {
      setError((e as Error).message);
      track('tool_used', { tool: 'can-xuong', result: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const style = result ? LEVEL_STYLE[result.fortune_level] : null;

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
    />
    <ToolPageShell
      eyebrow="Cổ truyền Việt Nam"
        relatedSlug="/can-xuong"
      icon={<span aria-hidden="true">⚖️</span>}
      title={
        <>
          Cân Xương <GoldAccent>Đoán Số</GoldAccent>
        </>
      }
      description="Phương pháp luận số cổ truyền Việt Nam — cân tổng năm, tháng, ngày, giờ sinh (theo lượng) rồi đối chiếu với câu thơ và lời luận giải."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Cân Xương Đoán Số' },
      ]}
    >
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Thông tin sinh thần</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="birth_date" className="text-foreground/85">
                    Ngày sinh (dương lịch)
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
                <div className="space-y-1.5">
                  <Label htmlFor="birth_hour" className="text-foreground/85">
                    Giờ sinh
                  </Label>
                  <select
                    id="birth_hour"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground"
                  >
                    {Array.from({ length: 24 }, (_, h) => {
                      const label =
                        h === 0
                          ? '00:00 (nửa đêm)'
                          : h < 12
                            ? `${String(h).padStart(2, '0')}:00 sáng`
                            : h === 12
                              ? '12:00 trưa'
                              : `${String(h).padStart(2, '0')}:00 chiều/tối`;
                      return (
                        <option key={h} value={h}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Cân Xương chỉ dùng cấp giờ (không cần phút). Nếu không nhớ giờ chính
                    xác, có thể chọn giờ gần đúng nhất.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/85">Giới tính</Label>
                  <RadioGroup
                    name="gender"
                    value={gender}
                    onValueChange={setGender}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="M" id="g-m" />
                      <Label htmlFor="g-m" className="font-normal text-foreground/85">
                        Nam
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="F" id="g-f" />
                      <Label htmlFor="g-f" className="font-normal text-foreground/85">
                        Nữ
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                  >
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Đang cân...' : 'Cân xương đoán số →'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {loading && <CanXuongLoadingSkeleton />}

          {!loading && !result && (
            <Card className="border-dashed border-border bg-card/30">
              <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div aria-hidden className="text-5xl">⚖️</div>
                <h2 className="mt-4 font-heading text-lg text-foreground">Chưa có kết quả</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Nhập ngày sinh và giờ sinh ở khung bên trái, hệ thống sẽ tính cân tổng năm – tháng – ngày –
                  giờ và đối chiếu với bài thơ luận số cổ.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && result && style && (
            <div className="space-y-4">
              <Card
                className={`relative overflow-hidden border ${style.ring} bg-gradient-to-br ${style.glow} to-transparent`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                />
                <CardContent className="relative p-6 text-center sm:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Tổng cân
                  </div>
                  <div className="my-2 bg-gold-gradient bg-clip-text font-heading text-5xl font-bold text-transparent">
                    {result.total_weight}
                  </div>
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${style.tag}`}
                  >
                    {result.fortune_level}
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Năm {result.input.can_chi_year} · Giờ {result.input.chi_hour}
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3">
                <ShareResultButton
                  path="/can-xuong"
                  title="Cân xương tính số"
                  text="Mình vừa xem cân xương theo ngày sinh trên hieu.asia — bạn thử nhé!"
                  trackId="can-xuong"
                />
                <DownloadToolPdfButton
                  source="pdf-can-xuong"
                  payload={() => {
                    if (!result) return null;
                    return {
                      title: 'Cân Xương Đoán Số — hieu.asia',
                      subtitle: `Năm ${result.input.can_chi_year} · Giờ ${result.input.chi_hour} · Tham khảo dân gian`,
                      hero: {
                        big: result.total_weight,
                        small: `Mức luận: ${result.fortune_level}`,
                      },
                      sections: [
                        {
                          heading: 'Cân từng trụ',
                          rows: [
                            { label: 'Cân năm', value: result.weight_year },
                            { label: 'Cân tháng', value: result.weight_month },
                            { label: 'Cân ngày', value: result.weight_day },
                            { label: 'Cân giờ', value: result.weight_hour },
                            { label: 'Tổng cân', value: result.total_weight },
                          ],
                        },
                        {
                          heading: 'Dữ liệu sinh thần',
                          rows: [
                            { label: 'Ngày sinh (dương lịch)', value: result.input.birth_date },
                            {
                              label: 'Ngày sinh (âm lịch)',
                              value: `${result.input.lunar_day}/${result.input.lunar_month}/${result.input.lunar_year}`,
                            },
                            { label: 'Năm can chi', value: result.input.can_chi_year },
                            { label: 'Canh giờ', value: result.input.chi_hour },
                          ],
                        },
                        {
                          heading: 'Câu thơ luận số',
                          text: result.poem,
                        },
                        {
                          heading: 'Luận giải',
                          text: result.interpretation,
                        },
                        {
                          heading: 'Đọc đúng tinh thần',
                          text: 'Cân xương là phép tra cứu dân gian nén ngày giờ sinh về một con số tổng kèm bài thơ cổ — độ phân giải thấp, dùng ngôn ngữ và chuẩn mực thời xưa. Hãy xem đây là lát cắt tham khảo nhanh; muốn phân tích cá nhân thật sự thì nên đào sâu bằng Tử Vi hoặc Bát Tự.',
                        },
                      ],
                    };
                  }}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeightCell label="Cân năm" value={result.weight_year} />
                <WeightCell label="Cân tháng" value={result.weight_month} />
                <WeightCell label="Cân ngày" value={result.weight_day} />
                <WeightCell label="Cân giờ" value={result.weight_hour} />
              </div>

              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base text-gold-700">Câu thơ luận số</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line font-heading text-base italic leading-relaxed text-foreground/90">
                    {result.poem}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base text-gold-700">Luận giải</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/85">{result.interpretation}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="cx-about-heading"
        className="mt-12 border-t border-border pt-10"
      >
        <h2
          id="cx-about-heading"
          className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
        >
          Cân xương tính số hoạt động thế nào?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
          <p>
            Phép cân xương — tương truyền gắn với{' '}
            <strong className="text-foreground">Viên Thiên Cang</strong> đời Đường,
            lưu truyền dân gian với nhiều dị bản — gán cho mỗi thành phần của ngày
            giờ sinh một &ldquo;trọng lượng xương&rdquo;: năm sinh theo can chi,
            tháng và ngày theo lịch âm, giờ theo 12 canh giờ. Cộng bốn thành phần
            được tổng số lạng, tra bài thơ cổ ứng với tổng đó. Công cụ đổi lịch âm
            và tra bảng <strong className="text-foreground">tự động, cố định</strong>{' '}
            — ai nhập cùng dữ liệu cũng ra đúng một kết quả.
          </p>
          <p>
            Minh bạch để bạn rõ: bài thơ luận giải dùng ngôn ngữ và chuẩn mực thời
            xưa, và cả phép tính chỉ nén ngày giờ sinh về MỘT con số tổng — độ phân
            giải thấp hơn Tử Vi hay Bát Tự rất nhiều. Hãy xem đây là lát cắt tham
            khảo nhanh đúng tinh thần &ldquo;không bói mù&rdquo;: thử cho biết, chiêm
            nghiệm phần thấy đúng, và đào sâu bằng lá số đầy đủ nếu muốn phân tích
            thật sự cá nhân.
          </p>
        </div>
      </section>

      <section aria-labelledby="cx-faq-heading" className="mt-10">
        <h2
          id="cx-faq-heading"
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
    <StickyMobileCta trackId="can-xuong" />
    </>
  );
}

function WeightCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3 text-center transition-colors hover:border-gold/30">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-heading text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}

function CanXuongLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <Skeleton className="mx-auto h-3 w-20" />
          <Skeleton className="mx-auto mt-3 h-12 w-32" />
          <Skeleton className="mx-auto mt-3 h-5 w-16 rounded-full" />
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}
