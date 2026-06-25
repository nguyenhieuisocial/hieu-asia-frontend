import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ExpertContent, ExpertTerm } from '@/components/reading/ModeContent';
import { getZodiacDailyOpener } from '@/lib/daily-opener';
import { isGenericSummary } from '@/lib/zodiac-blurb';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const ZODIAC_LABEL: Record<string, string> = {
  ty: 'Tý', suu: 'Sửu', dan: 'Dần', mao: 'Mão',
  thin: 'Thìn', ti: 'Tỵ', ngo: 'Ngọ', mui: 'Mùi',
  than: 'Thân', dau: 'Dậu', tuat: 'Tuất', hoi: 'Hợi',
};

const ZODIAC_ICON: Record<string, string> = {
  ty: '🐭', suu: '🐂', dan: '🐯', mao: '🐰',
  thin: '🐲', ti: '🐍', ngo: '🐴', mui: '🐐',
  than: '🐵', dau: '🐓', tuat: '🐶', hoi: '🐷',
};

interface Score {
  score: number;
  summary: string;
}

interface Horoscope {
  date: string;
  lunar_date: string;
  zodiac: string;
  zodiac_key: string;
  zodiac_vi: string;
  zodiac_icon: string;
  overall: Score;
  career: Score;
  love: Score;
  money: Score;
  health: Score;
  lucky_numbers: number[];
  lucky_colors: string[];
  lucky_direction: string;
  good_hours: string[];
  avoid: string;
  detailed_text: string;
}

interface FetchResponse {
  ok: boolean;
  horoscope?: Horoscope;
  error?: string;
}

async function fetchOne(zodiac: string): Promise<Horoscope | null> {
  try {
    const base = process.env.PUBLIC_SITE_URL ?? 'https://hieu.asia';
    const res = await fetch(`${base}/api/daily/horoscope?zodiac=${zodiac}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as FetchResponse;
    return data.horoscope ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ zodiac: string }> }): Promise<Metadata> {
  const { zodiac } = await params;
  const label = ZODIAC_LABEL[zodiac] ?? zodiac;
  return {
    title: `Tử Vi tuổi ${label} hôm nay`,
    description: `Tử Vi hôm nay cho tuổi ${label}: tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe, giờ tốt, hướng tốt.`,
    alternates: { canonical: `https://hieu.asia/tu-vi-hom-nay/${zodiac}` },
    openGraph: {
      title: `Tử Vi tuổi ${label} hôm nay`,
      description: `4 lĩnh vực, số/màu/hướng may mắn và lưu ý cho tuổi ${label}.`,
      url: `https://hieu.asia/tu-vi-hom-nay/${zodiac}`,
      type: 'article',
      images: [{ url: 'https://hieu.asia/og-image.jpg', width: 1200, height: 630, alt: `Tử Vi tuổi ${label} hôm nay` }],
    },
    twitter: { card: 'summary_large_image', title: `Tử Vi tuổi ${label} hôm nay`, images: ['https://hieu.asia/og-image.jpg'] },
  };
}

function ScoreRow({
  label,
  expertCung,
  score,
  summary,
}: {
  label: string;
  /** Tên cung tương ứng trong Tử Vi (chỉ hiển thị ở chế độ Chuyên gia). */
  expertCung?: string;
  score: number;
  summary: string;
}) {
  const pct = Math.max(0, Math.min(100, score * 10));
  const color = score >= 8 ? 'bg-emerald-400' : score >= 6 ? 'bg-gold' : score >= 4 ? 'bg-amber-400' : 'bg-rose-400';
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {label}
          {expertCung && (
            <ExpertTerm className="ml-1 text-muted-foreground">({expertCung})</ExpertTerm>
          )}
        </span>
        <span className="text-muted-foreground">{score}/10</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted/10">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {summary ? <p className="mt-2 text-sm text-muted-foreground">{summary}</p> : null}
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ zodiac: string }> }) {
  const { zodiac } = await params;
  if (!(zodiac in ZODIAC_LABEL)) notFound();
  const h = await fetchOne(zodiac);
  const label = ZODIAC_LABEL[zodiac] ?? zodiac;
  const icon = ZODIAC_ICON[zodiac] ?? '🔮';

  const bar = (s: number) => Math.max(0, Math.min(100, s * 10));
  const pdfPayload: ToolPdfPayload | null = h
    ? {
        title: `Tử Vi tuổi ${label} hôm nay — hieu.asia`,
        subtitle: `${h.date}${h.lunar_date ? ` · ${h.lunar_date}` : ''} · tổng quan ${h.overall.score}/10`,
        hero: { big: `${icon} Tuổi ${label}`, small: `Tổng quan hôm nay: ${h.overall.score}/10` },
        sections: [
          {
            heading: 'Tổng quan hôm nay',
            text: getZodiacDailyOpener(zodiac, h.overall.score) + (h.detailed_text ? `\n\n${h.detailed_text}` : ''),
          },
          {
            heading: 'Bốn lĩnh vực',
            rows: [
              { label: 'Sự nghiệp', value: `${h.career.score}/10`, bar: bar(h.career.score) },
              { label: 'Tình duyên', value: `${h.love.score}/10`, bar: bar(h.love.score) },
              { label: 'Tài lộc', value: `${h.money.score}/10`, bar: bar(h.money.score) },
              { label: 'Sức khỏe', value: `${h.health.score}/10`, bar: bar(h.health.score) },
            ],
          },
          {
            heading: 'Vận may hôm nay',
            rows: [
              { label: 'Số may mắn', value: h.lucky_numbers.join(' · ') },
              { label: 'Màu may mắn', value: h.lucky_colors.join(' · ') },
              { label: 'Hướng tốt', value: h.lucky_direction },
              { label: 'Giờ tốt', value: h.good_hours.join(' · ') },
            ],
          },
          ...(h.avoid ? [{ heading: 'Nên tránh', text: h.avoid }] : []),
          {
            heading: 'Lưu ý',
            text: 'Tử vi hằng ngày là tham chiếu để định hướng tâm thế trong ngày — không phải mệnh lệnh. Bản PDF này chụp lại vận trình của ngày xuất file.',
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pt-16">
      <section className="relative isolate overflow-hidden border-b border-border bg-card/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-ink-radial opacity-80 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[260px] w-[260px] rounded-full bg-gold/15 blur-3xl -z-10"
        />
        <div className="mx-auto max-w-3xl px-6 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/tu-vi-hom-nay" className="hover:text-gold">Tử Vi hôm nay</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tuổi {label}</span>
          </nav>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tử Vi hằng ngày
          </p>
          <div className="mt-3 flex items-start gap-4">
            <div className="text-5xl sm:text-6xl" aria-hidden>{icon}</div>
            <div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Tử Vi tuổi{' '}
                <span className="bg-gold-gradient bg-clip-text text-transparent">{label}</span>{' '}
                hôm nay
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {h?.date ?? '—'}{h?.lunar_date ? ` · ${h.lunar_date}` : ''}
              </p>
              {h ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                  Tổng quan: {h.overall.score}/10
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {!h ? (
        <section className="mx-auto max-w-3xl px-6 py-10 text-center text-muted-foreground">
          Đang tải tử vi cho tuổi {label}…
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-3xl px-6 py-8">
            <p className="rounded-2xl border border-border bg-card/40 p-5 text-base leading-relaxed text-foreground/85">
              <span className="text-foreground">
                {getZodiacDailyOpener(zodiac, h.overall.score)}
              </span>
              {h.detailed_text ? (
                <>
                  {' '}
                  <span className="text-muted-foreground">{h.detailed_text}</span>
                </>
              ) : null}
            </p>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Bốn lĩnh vực
              <ExpertTerm className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.24em] text-gold/80">
                · tứ cung trọng yếu
              </ExpertTerm>
            </h2>
            <ExpertContent className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Bốn lĩnh vực bên dưới đối chiếu với bốn cung trong lá số: Quan Lộc · Phu Thê ·
              Tài Bạch · Tật Ách. Điểm số phản ánh tương tác của tiểu hạn ngày với chính
              tinh thủ cung tương ứng.
            </ExpertContent>
            <div className="mt-4 space-y-5 rounded-2xl border border-border bg-card/40 p-5">
              {/* Drop per-field text when upstream returns the identical generic
                  fallback (degraded-LLM day) — show the score/bar only rather
                  than the same line on all 12 zodiacs. The per-zodiac opener
                  above stays deterministic, so the page is never Barnum-generic. */}
              <ScoreRow label="Sự nghiệp" expertCung="cung Quan Lộc" score={h.career.score} summary={isGenericSummary(h.career.summary) ? '' : h.career.summary} />
              <ScoreRow label="Tình duyên" expertCung="cung Phu Thê" score={h.love.score} summary={isGenericSummary(h.love.summary) ? '' : h.love.summary} />
              <ScoreRow label="Tài lộc" expertCung="cung Tài Bạch" score={h.money.score} summary={isGenericSummary(h.money.summary) ? '' : h.money.summary} />
              <ScoreRow label="Sức khỏe" expertCung="cung Tật Ách" score={h.health.score} summary={isGenericSummary(h.health.summary) ? '' : h.health.summary} />
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">Vận may hôm nay</h2>
            <ExpertContent className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Hướng tốt và giờ tốt suy ra từ tiểu hạn ngày kết hợp với địa chi tuổi —
              dùng làm tham chiếu, không phải mệnh lệnh.
            </ExpertContent>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Info label="Số may mắn" value={h.lucky_numbers.join(' · ')} />
              <Info label="Màu may mắn" value={h.lucky_colors.join(' · ')} />
              <Info label="Hướng tốt" value={h.lucky_direction} />
              <Info label="Giờ tốt" value={h.good_hours.join(' · ')} />
            </div>
          </section>

          {h.avoid ? (
            <section className="mx-auto max-w-3xl px-6 py-4">
              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-foreground/85">
                <strong className="text-rose-300">Nên tránh:</strong> {h.avoid}
              </div>
            </section>
          ) : null}

          <section className="mx-auto max-w-3xl px-6 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/tu-vi-hom-nay" className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-gold hover:text-gold">
                ← Xem tuổi khác
              </Link>
              <div className="flex items-center gap-2">
                {pdfPayload && (
                  <DownloadToolPdfButton source="pdf-tu-vi-hom-nay" label="Tải PDF hôm nay" payload={pdfPayload} />
                )}
                <ShareButton zodiac={zodiac} label={label} score={h.overall.score} />
              </div>
            </div>
          </section>
        </>
      )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold text-foreground">{value || '—'}</div>
    </div>
  );
}

function ShareButton({ zodiac, label, score }: { zodiac: string; label: string; score: number }) {
  const url = `https://hieu.asia/tu-vi-hom-nay/${zodiac}`;
  const text = `Tử Vi tuổi ${label} hôm nay ${score}/10 — hieu.asia`;
  const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold/90"
    >
      Chia sẻ
    </a>
  );
}
