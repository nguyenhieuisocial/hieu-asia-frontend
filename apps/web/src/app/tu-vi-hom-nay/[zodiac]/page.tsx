import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ExpertContent, ExpertTerm } from '@/components/reading/ModeContent';
import { getZodiacDailyOpener } from '@/lib/daily-opener';

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
    title: `Tử vi tuổi ${label} hôm nay`,
    description: `Tử vi hôm nay cho tuổi ${label}: tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe, giờ tốt, hướng tốt.`,
    alternates: { canonical: `https://hieu.asia/tu-vi-hom-nay/${zodiac}` },
    openGraph: {
      title: `Tử vi tuổi ${label} hôm nay · hieu.asia`,
      description: `4 lĩnh vực, số/màu/hướng may mắn và lưu ý cho tuổi ${label}.`,
      url: `https://hieu.asia/tu-vi-hom-nay/${zodiac}`,
      type: 'article',
    },
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
            <Link href="/tu-vi-hom-nay" className="hover:text-gold">Tử vi hôm nay</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tuổi {label}</span>
          </nav>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tử vi hằng ngày
          </p>
          <div className="mt-3 flex items-start gap-4">
            <div className="text-5xl sm:text-6xl" aria-hidden>{icon}</div>
            <div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Tử vi tuổi{' '}
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
              <ScoreRow label="Sự nghiệp" expertCung="cung Quan Lộc" score={h.career.score} summary={h.career.summary} />
              <ScoreRow label="Tình duyên" expertCung="cung Phu Thê" score={h.love.score} summary={h.love.summary} />
              <ScoreRow label="Tài lộc" expertCung="cung Tài Bạch" score={h.money.score} summary={h.money.summary} />
              <ScoreRow label="Sức khỏe" expertCung="cung Tật Ách" score={h.health.score} summary={h.health.summary} />
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
              <ShareButton zodiac={zodiac} label={label} score={h.overall.score} />
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
  const text = `Tử vi tuổi ${label} hôm nay ${score}/10 — hieu.asia`;
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
