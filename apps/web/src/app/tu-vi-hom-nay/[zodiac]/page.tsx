import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const ZODIAC_LABEL: Record<string, string> = {
  ty: 'Tý', suu: 'Sửu', dan: 'Dần', mao: 'Mão',
  thin: 'Thìn', ty2: 'Tỵ', ngo: 'Ngọ', mui: 'Mùi',
  than: 'Thân', dau: 'Dậu', tuat: 'Tuất', hoi: 'Hợi',
};

const ZODIAC_ICON: Record<string, string> = {
  ty: '🐭', suu: '🐂', dan: '🐯', mao: '🐰',
  thin: '🐲', ty2: '🐍', ngo: '🐴', mui: '🐐',
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
  };
}

function ScoreRow({ label, score, summary }: { label: string; score: number; summary: string }) {
  const pct = Math.max(0, Math.min(100, score * 10));
  const color = score >= 8 ? 'bg-emerald-400' : score >= 6 ? 'bg-gold' : score >= 4 ? 'bg-amber-400' : 'bg-rose-400';
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-cream">{label}</span>
        <span className="text-cream/70">{score}/10</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream/10">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {summary ? <p className="mt-2 text-sm text-cream/70">{summary}</p> : null}
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
    <main id="main-content" className="min-h-screen bg-ink text-cream">
      <section className="border-b border-cream/5 bg-ink/60">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/tu-vi-hom-nay" className="text-xs text-cream/60 hover:text-gold">
            ← Xem tuổi khác
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <div className="text-5xl sm:text-6xl" aria-hidden>{icon}</div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
                Tử vi tuổi {label} hôm nay
              </h1>
              <p className="mt-1 text-sm text-cream/60">
                {h?.date ?? '—'}{h?.lunar_date ? ` · ${h.lunar_date}` : ''}
              </p>
              {h ? (
                <div className="mt-3 text-2xl font-bold text-gold">
                  Tổng quan: {h.overall.score}/10
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {!h ? (
        <section className="mx-auto max-w-3xl px-6 py-10 text-center text-cream/70">
          Đang tải tử vi cho tuổi {label}…
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-3xl px-6 py-8">
            <p className="rounded-2xl border border-cream/10 bg-ink/40 p-5 text-base leading-relaxed text-cream/85">
              {h.detailed_text}
            </p>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-4">
            <h2 className="font-heading text-xl font-semibold text-cream">Bốn lĩnh vực</h2>
            <div className="mt-4 space-y-5 rounded-2xl border border-cream/10 bg-ink/40 p-5">
              <ScoreRow label="Sự nghiệp" score={h.career.score} summary={h.career.summary} />
              <ScoreRow label="Tình duyên" score={h.love.score} summary={h.love.summary} />
              <ScoreRow label="Tài lộc" score={h.money.score} summary={h.money.summary} />
              <ScoreRow label="Sức khỏe" score={h.health.score} summary={h.health.summary} />
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-4">
            <h2 className="font-heading text-xl font-semibold text-cream">Vận may hôm nay</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Info label="Số may mắn" value={h.lucky_numbers.join(' · ')} />
              <Info label="Màu may mắn" value={h.lucky_colors.join(' · ')} />
              <Info label="Hướng tốt" value={h.lucky_direction} />
              <Info label="Giờ tốt" value={h.good_hours.join(' · ')} />
            </div>
          </section>

          {h.avoid ? (
            <section className="mx-auto max-w-3xl px-6 py-4">
              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-cream/85">
                <strong className="text-rose-300">Nên tránh:</strong> {h.avoid}
              </div>
            </section>
          ) : null}

          <section className="mx-auto max-w-3xl px-6 py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/tu-vi-hom-nay" className="rounded-lg border border-cream/20 px-4 py-2 text-sm text-cream/80 hover:border-gold hover:text-gold">
                ← Xem tuổi khác
              </Link>
              <ShareButton zodiac={zodiac} label={label} score={h.overall.score} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cream/10 bg-ink/40 p-3">
      <div className="text-xs uppercase tracking-wide text-cream/50">{label}</div>
      <div className="mt-1 text-base font-semibold text-cream">{value || '—'}</div>
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
