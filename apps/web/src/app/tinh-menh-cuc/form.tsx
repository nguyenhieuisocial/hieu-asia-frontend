'use client';

import * as React from 'react';
import Link from 'next/link';
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
} from '@hieu-asia/ui';
import { Time24 } from '@/components/Time24';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import { castTuViChart, type TuViChart } from '@/lib/tuvi-client';
import { getNguHanhRemedy, type NguHanhRemedy } from '@/lib/ngu-hanh-remedy';

type Gender = 'male' | 'female';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Cung Mệnh là gì?',
    a: 'Cung Mệnh là cung gốc của lá số Tử Vi — nơi "đứng" của bản mệnh, mô tả tư duy, cá tính và cách bạn nhìn cuộc đời. Vị trí cung Mệnh được an theo tháng sinh và giờ sinh trên vòng 12 cung địa chi, nên cần giờ sinh chính xác.',
  },
  {
    q: 'Cung Thân khác cung Mệnh thế nào?',
    a: 'Cung Mệnh thiên về bản chất bên trong; cung Thân thiên về hành động và phần thể hiện ra ngoài, thường được xem nặng hơn ở nửa sau cuộc đời. Tuỳ giờ sinh, cung Thân sẽ đóng cùng một trong các cung Mệnh, Phúc Đức, Quan Lộc, Tài Bạch, Thiên Di hoặc Phu Thê.',
  },
  {
    q: 'Cục là gì và dùng để làm gì?',
    a: 'Cục là ngũ hành cục của lá số: Thủy nhị cục, Mộc tam cục, Kim tứ cục, Thổ ngũ cục, Hỏa lục cục — xác định từ can năm sinh kết hợp vị trí cung Mệnh. Cục quyết định tuổi bắt đầu đại vận (2 / 3 / 4 / 5 / 6 tuổi) và nhịp an sao Tử Vi — mắt xích nối phần "tĩnh" của lá số với vận động theo thời gian.',
  },
  {
    q: 'Âm dương thuận nghịch ảnh hưởng gì?',
    a: 'Âm dương của năm sinh kết hợp giới tính quyết định chiều đi của đại vận: dương nam và âm nữ đi thuận, âm nam và dương nữ đi nghịch. Cùng ngày giờ sinh nhưng khác giới tính sẽ có trình tự đại vận ngược nhau — vì vậy công cụ này hỏi giới tính.',
  },
  {
    q: 'Công cụ này khác lá số đầy đủ thế nào?',
    a: 'Đây là bước tra cứu NỀN: cung Mệnh, cung Thân, Cục và âm dương — phần khung của lá số. Lá số đầy đủ an tiếp 14 chính tinh cùng phụ tinh vào 12 cung rồi mới luận giải sâu. Phần tính ở đây dùng đúng thuật toán lập lá số chuẩn — ai nhập cùng dữ liệu cũng ra cùng kết quả.',
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

export function TinhMenhCucForm() {
  const [birthDate, setBirthDate] = React.useState('');
  const [birthHour, setBirthHour] = React.useState('12:00');
  const [gender, setGender] = React.useState<Gender>('male');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<TuViChart | null>(null);
  const [hasTime, setHasTime] = React.useState(true);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const hour = Number(birthHour.split(':')[0]);
      if (!birthDate || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(birthDate)) {
        throw new Error('Ngày sinh phải có dạng YYYY-MM-DD.');
      }
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) {
        throw new Error('Giờ sinh phải từ 0 đến 23.');
      }
      const chart = await castTuViChart({
        birthSolarDate: birthDate,
        birthHour: hour,
        gender,
      });
      setResult(chart);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/tu-vi" className="hover:text-gold">
              Tử Vi
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tính Mệnh Cục</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
            Free tool · Bước 1 của Tử Vi
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tính Mệnh Cục miễn phí
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Bước đầu tiên khi đọc lá số Tử Vi: xác định cung Mệnh, cung Thân, Cục và âm
            dương. 30 giây, không cần đăng ký.
          </p>
        </section>

        <section className="relative mx-auto max-w-2xl px-6 pb-12">
          <Card className="border-gold/20 bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground">
                Nhập ngày–giờ sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birth-date">Ngày sinh dương lịch</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max="2030-12-31"
                    min="1900-01-01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth-hour">
                    Giờ sinh{' '}
                    {!hasTime && (
                      <span className="font-mono text-[10px] text-amber-300">
                        — không nhớ giờ thì để 12:00
                      </span>
                    )}
                  </Label>
                  <Time24 id="birth-hour" value={birthHour} onChange={setBirthHour} />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={!hasTime}
                      onChange={(e) => setHasTime(!e.target.checked)}
                      className="h-3.5 w-3.5"
                    />
                    Tôi không nhớ giờ sinh (kết quả độ chính xác thấp hơn)
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    name="gender-tmc"
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                    className="flex gap-4"
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="male" id="g-male" />
                      Nam
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="female" id="g-female" />
                      Nữ
                    </label>
                  </RadioGroup>
                </div>

                {error && (
                  <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Đang tính…' : 'Tính Mệnh Cục'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {result && (
          <section className="relative mx-auto max-w-2xl px-6 pb-12">
            <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                  <Sparkles className="h-5 w-5 text-gold" aria-hidden /> Kết quả của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultRow
                    label="Cung Mệnh"
                    value={`${result.meta.soul} · ${result.meta.earthlyBranchOfSoulPalace}`}
                    hint="Khí chất bẩm sinh + thiên hướng cốt lõi"
                  />
                  <ResultRow
                    label="Cung Thân"
                    value={`${result.meta.body} · ${result.meta.earthlyBranchOfBodyPalace}`}
                    hint="Cách đời sống kéo bạn hành động"
                  />
                  <ResultRow
                    label="Cục"
                    value={result.meta.fiveElementsClass}
                    hint="Ngũ Hành chủ + chu kỳ đại vận"
                  />
                  <ResultRow
                    label="Can Chi năm"
                    value={result.meta.chineseDate.split(' - ')[0] ?? '—'}
                    hint="Năm âm lịch + thiên can địa chi"
                  />
                  <ResultRow
                    label="Con giáp"
                    value={result.meta.zodiac}
                    hint="Theo địa chi năm sinh"
                  />
                  <ResultRow
                    label="Cung hoàng đạo"
                    value={result.meta.sign}
                    hint="Tham chiếu phương Tây"
                  />
                </div>

                {!hasTime && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-700/40 bg-amber-900/10 p-3 text-xs leading-relaxed text-amber-100/90">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                    <p>
                      Bạn không nhớ giờ sinh — kết quả ở trên dùng giờ Ngọ (12h) mặc định.
                      Cung Mệnh/Thân có thể đổi nếu giờ thực lệch 30 phút trở lên. Để
                      chính xác, lập lá số đầy đủ + hỏi Mentor.
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  Đây là phần cấu trúc — bước 1 của lá số. Để xem 12 cung tương tác, 14
                  chính tinh và đại vận của riêng bạn, lập lá số đầy đủ (vẫn miễn phí).
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg"><Link href="/onboarding">
                    Lập lá số đầy đủ
                  </Link></Button>
                  <DownloadToolPdfButton
                    source="pdf-tinh-menh-cuc"
                    payload={() => {
                      if (!result) return null;
                      const m = result.meta;
                      const remedy = getNguHanhRemedy(m.fiveElementsClass);
                      const sections: ToolPdfPayload['sections'] = [
                        {
                          heading: 'Nền lá số của bạn',
                          rows: [
                            {
                              label: 'Cung Mệnh',
                              value: `${m.soul} · ${m.earthlyBranchOfSoulPalace}`,
                            },
                            {
                              label: 'Cung Thân',
                              value: `${m.body} · ${m.earthlyBranchOfBodyPalace}`,
                            },
                            { label: 'Cục', value: m.fiveElementsClass },
                            {
                              label: 'Can Chi năm',
                              value: m.chineseDate.split(' - ')[0] ?? '—',
                            },
                            { label: 'Con giáp', value: m.zodiac },
                            { label: 'Cung hoàng đạo (Tây)', value: m.sign },
                            { label: 'Ngày dương lịch', value: m.solarDate },
                            { label: 'Ngày âm lịch', value: m.lunarDate },
                            { label: 'Giờ sinh', value: `${m.time} (${m.timeRange})` },
                          ],
                        },
                        {
                          heading: 'Cục là gì?',
                          text:
                            'Cục trong Tử Vi xác định CHU KỲ ĐẠI VẬN của bạn — 10 năm 1 đại vận. Có 5 loại Cục theo ngũ hành:\n' +
                            '• Thủy nhị cục — đại vận từ 2 tuổi\n' +
                            '• Mộc tam cục — đại vận từ 3 tuổi\n' +
                            '• Kim tứ cục — đại vận từ 4 tuổi\n' +
                            '• Thổ ngũ cục — đại vận từ 5 tuổi\n' +
                            '• Hỏa lục cục — đại vận từ 6 tuổi\n\n' +
                            'Mệnh hoà với Cục → giai đoạn phát triển thuận. Mệnh khắc Cục → cảm giác "vận ngược" — không phải định mệnh, là dấu hiệu cần thay đổi cách tiếp cận.',
                        },
                      ];
                      if (remedy) {
                        sections.push({
                          heading: `Gợi ý bổ khuyết ngũ hành — hành ${remedy.hanh} (tham khảo)`,
                          rows: [
                            { label: 'Màu sắc phù hợp', value: remedy.mauHop.join(', ') },
                            { label: 'Hướng tốt', value: remedy.huongTot.join(', ') },
                            { label: 'Nhóm nghề phù hợp', value: remedy.ngheHop.join(', ') },
                            { label: 'Vật phẩm & môi trường', value: remedy.vatPham.join(', ') },
                          ],
                        });
                        sections.push({
                          heading: 'Lời khuyên hành động',
                          text: remedy.loiKhuyen
                            .map((lk, i) => `${String(i + 1).padStart(2, '0')}. ${lk}`)
                            .join('\n'),
                        });
                      }
                      return {
                        title: 'Mệnh · Thân · Cục — hieu.asia',
                        subtitle: 'Bước 1 của lá số Tử Vi — cung Mệnh, cung Thân, Cục và âm dương',
                        hero: {
                          big: `Mệnh tại ${m.earthlyBranchOfSoulPalace} · Cục ${m.fiveElementsClass}`,
                          small: `${m.soul} · Thân tại ${m.earthlyBranchOfBodyPalace} · ${m.zodiac}`,
                        },
                        sections,
                      };
                    }}
                  />
                  <Link
                    href="/tu-vi"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
                  >
                    Cẩm nang Tử Vi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {result && <NguHanhRemedySection fiveElementsClass={result.meta.fiveElementsClass} />}

        <section className="relative mx-auto max-w-2xl px-6 pb-20">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground">
                Cục là gì?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cục trong Tử Vi xác định CHU KỲ ĐẠI VẬN của bạn — 10 năm 1 đại vận.
                Có 5 loại Cục theo ngũ hành:
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-gold-700">Thủy nhị cục</strong> — đại vận từ 2 tuổi
                </li>
                <li>
                  <strong className="text-gold-700">Mộc tam cục</strong> — đại vận từ 3 tuổi
                </li>
                <li>
                  <strong className="text-gold-700">Kim tứ cục</strong> — đại vận từ 4 tuổi
                </li>
                <li>
                  <strong className="text-gold-700">Thổ ngũ cục</strong> — đại vận từ 5 tuổi
                </li>
                <li>
                  <strong className="text-gold-700">Hỏa lục cục</strong> — đại vận từ 6 tuổi
                </li>
              </ul>
              <p className="text-muted-foreground">
                Mệnh hoà với Cục → giai đoạn phát triển thuận. Mệnh khắc Cục → cảm giác
                "vận ngược" — không phải định mệnh, là dấu hiệu cần thay đổi cách tiếp
                cận. Mentor sẽ giải thích chi tiết khi bạn lập lá số đầy đủ.
              </p>
            </CardContent>
          </Card>
        </section>

        <section
          aria-labelledby="tmc-method-heading"
          className="relative mx-auto max-w-3xl px-6 pb-12"
        >
          <h2
            id="tmc-method-heading"
            className="mb-4 font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Cách tính Mệnh — Thân — Cục
          </h2>
          <ol className="space-y-3 text-sm leading-relaxed text-foreground/80">
            <li className="flex gap-3">
              <span className="shrink-0 font-mono text-gold-700">01</span>
              <span>
                <strong className="text-foreground">An cung Mệnh:</strong> từ tháng
                sinh âm lịch và giờ sinh, đếm trên vòng 12 cung địa chi để xác định
                cung Mệnh — vì vậy sai giờ sinh là lệch cả lá số.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-mono text-gold-700">02</span>
              <span>
                <strong className="text-foreground">An cung Thân:</strong> cũng từ
                tháng và giờ sinh nhưng đếm theo chiều ngược lại — cung Thân luôn rơi
                vào một trong sáu vị trí cố định của lá số.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-mono text-gold-700">03</span>
              <span>
                <strong className="text-foreground">Định Cục:</strong> ghép can năm
                sinh với vị trí cung Mệnh, tra nạp âm để ra ngũ hành cục — con số của
                Cục (2–6) chính là tuổi bắt đầu đại vận đầu tiên.
              </span>
            </li>
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Minh bạch: toàn bộ phần tính chạy bằng thuật toán lập lá số chuẩn — không
            có "cảm nhận của thầy" ở bước này. Phần cần thận trọng là bước LUẬN GIẢI
            sau con số, và đó là lý do hieu.asia luôn ghi rõ đâu là tính toán, đâu là
            diễn giải.
          </p>
        </section>

        <section
          aria-labelledby="tmc-faq-heading"
          className="relative mx-auto max-w-3xl px-6 pb-12"
        >
          <h2
            id="tmc-faq-heading"
            className="mb-4 font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Câu hỏi thường gặp
          </h2>
          <dl className="space-y-3">
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
      </main>
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools current="/tinh-menh-cuc" />
      </div>
      <SiteFooter />
    </div>
  );
}

function ResultRow({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-md border border-border bg-card/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-lg font-semibold text-gold-700">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

/**
 * Section "Gợi ý bổ khuyết ngũ hành" — chỉ đọc fiveElementsClass từ chart,
 * không đụng engine cast lá số.
 */
function NguHanhRemedySection({ fiveElementsClass }: { fiveElementsClass: string }) {
  const remedy: NguHanhRemedy | null = getNguHanhRemedy(fiveElementsClass);
  if (!remedy) return null;

  return (
    <section className="relative mx-auto max-w-2xl px-6 pb-12">
      <Card className="border-gold/20 bg-card/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <CardTitle className="font-heading text-xl text-foreground">
              Gợi ý bổ khuyết ngũ hành (tham khảo)
            </CardTitle>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Đây là gợi ý tham khảo theo ngũ hành, không phải lời phán về số mệnh.
            Áp dụng hay không tuỳ bối cảnh cá nhân — hieu.asia không phán, chỉ gợi ý.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Màu hợp */}
          <RemedyBlock
            title={`Màu sắc phù hợp với hành ${remedy.hanh}`}
            items={remedy.mauHop}
            hint="Theo Ngũ Hành học, màu tương sinh với hành chủ đạo giúp cân bằng năng lượng."
          />

          {/* Hướng tốt */}
          <RemedyBlock
            title="Hướng tốt"
            items={remedy.huongTot}
            hint="Hướng bàn làm việc, cửa chính hoặc hướng ngủ theo Phong Thủy Ngũ Hành."
          />

          {/* Nhóm nghề */}
          <RemedyBlock
            title="Nhóm nghề phù hợp"
            items={remedy.ngheHop}
            hint="Ngành nghề cộng hưởng với đặc tính hành chủ đạo — không phải giới hạn, chỉ là xu hướng thuận."
          />

          {/* Vật phẩm / môi trường */}
          <RemedyBlock
            title="Vật phẩm & môi trường hỗ trợ"
            items={remedy.vatPham}
            hint="Không cần mua nhiều — chọn 1–2 thứ phù hợp hoàn cảnh, đặt nơi bạn làm việc hoặc nghỉ ngơi."
          />

          {/* Lời khuyên hành động */}
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Lời khuyên hành động
            </p>
            <ol className="space-y-2">
              {remedy.loiKhuyen.map((lk, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                  <span className="shrink-0 font-mono text-gold-700">{String(i + 1).padStart(2, '0')}</span>
                  <span>{lk}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            Nguồn quy tắc: Ngũ Hành học cổ điển (tương sinh/tương khắc chuẩn) + bảng
            hướng Phong Thủy phổ biến tại Việt Nam. Kết quả mang tính gợi ý, không thay
            thế tư vấn chuyên sâu từ chuyên gia Tử Vi có kinh nghiệm.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function RemedyBlock({ title, items, hint }: { title: string; items: string[]; hint: string }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs font-medium text-gold-700"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}
