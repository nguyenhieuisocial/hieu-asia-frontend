'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface NumberCard {
  number: number;
  name: string;
  meaning: string;
}
interface PinnacleCycle {
  index: number;
  number: number;
  age_range: string;
  meaning: string;
}
interface ChallengePoint {
  index: number;
  number: number;
  meaning: string;
}
interface ThanSoHocResult {
  life_path: NumberCard;
  expression: NumberCard;
  soul_urge: NumberCard;
  personality: NumberCard;
  birthday: NumberCard;
  maturity: NumberCard;
  personal_year: NumberCard;
  personal_month: NumberCard;
  pinnacle_cycles: PinnacleCycle[];
  challenges: ChallengePoint[];
  karmic_lessons: number[];
  karmic_debt?: number;
  master_numbers: number[];
  input: { birth_date: string; full_name: string; current_year: number };
}

export default function ThanSoHocResultPage() {
  const sp = useSearchParams();
  const fullName = sp.get('full_name') ?? '';
  const birthDate = sp.get('birth_date') ?? '';
  const [data, setData] = React.useState<ThanSoHocResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/tools/than-so-hoc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: fullName, birth_date: birthDate }),
        });
        const json = (await res.json()) as { ok: boolean; result?: ThanSoHocResult; error?: string };
        if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tính được kết quả');
        if (!cancelled) setData(json.result);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (fullName && birthDate) load();
    else { setError('Thiếu thông tin'); setLoading(false); }
    return () => { cancelled = true; };
  }, [fullName, birthDate]);

  if (loading) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-ink pt-20">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <Breadcrumb />
            <div className="rounded-lg border border-cream/10 bg-ink/40 p-10 text-center text-sm text-cream/70">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" aria-hidden="true" />
              Đang phân tích thần số học...
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-ink pt-20">
          <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
            <Breadcrumb />
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
              {error ?? 'Có lỗi xảy ra.'}
            </div>
            <Link href="/than-so-hoc" className="text-sm text-gold underline-offset-4 hover:underline">
              ← Thử lại
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-ink pt-20 text-cream">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Breadcrumb />
      <header className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bản đồ Thần Số Học</h1>
        <p className="text-sm text-foreground/70">
          {data.input.full_name} · Sinh ngày {data.input.birth_date}
        </p>
        {(data.karmic_debt || data.master_numbers.length > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {data.master_numbers.length > 0 && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                Master Numbers: {data.master_numbers.join(', ')}
              </span>
            )}
            {data.karmic_debt && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                Nợ nghiệp: {data.karmic_debt}
              </span>
            )}
          </div>
        )}
      </header>

      <section>
        <HeroNumber card={data.life_path} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <NumberCardView card={data.expression} />
        <NumberCardView card={data.soul_urge} />
        <NumberCardView card={data.personality} />
        <NumberCardView card={data.birthday} />
        <NumberCardView card={data.maturity} />
        <NumberCardView card={data.personal_year} highlight />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>{data.personal_month.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="font-heading text-4xl text-gold">{data.personal_month.number}</div>
              <p className="text-sm text-foreground/80">{data.personal_month.meaning}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">4 Chu kỳ đỉnh cao cuộc đời</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {data.pinnacle_cycles.map((p) => (
            <div key={p.index} className="rounded-lg border bg-card p-4">
              <div className="text-xs uppercase text-foreground/60">Đỉnh {p.index} · {p.age_range}</div>
              <div className="my-1 font-heading text-3xl text-gold">{p.number}</div>
              <div className="text-xs text-foreground/75">{p.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Thử thách cuộc đời</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {data.challenges.map((c) => (
            <div key={c.index} className="rounded-lg border bg-card p-4">
              <div className="text-xs uppercase text-foreground/60">Thử thách {c.index}</div>
              <div className="my-1 font-heading text-3xl text-rose-500">{c.number}</div>
              <div className="text-xs text-foreground/75">{c.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      {data.karmic_lessons.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Bài học nghiệp (Karmic Lessons)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">
                Các con số sau đây không xuất hiện trong tên bạn. Đây là những bài học cuộc đời
                bạn cần học để hoàn thiện bản thân:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.karmic_lessons.map((n) => (
                  <span key={n} className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-medium text-amber-700">
                    Số {n}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="text-center pt-4">
        <Link href="/than-so-hoc" className="text-sm text-gold underline-offset-4 hover:underline">
          ← Tính số khác
        </Link>
      </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-cream/55">
      <Link href="/" className="hover:text-gold">Trang chủ</Link>
      <span className="mx-1.5">/</span>
      <Link href="/than-so-hoc" className="hover:text-gold">Thần Số Học</Link>
      <span className="mx-1.5">/</span>
      <span className="text-cream/70">Kết quả</span>
    </nav>
  );
}

function HeroNumber({ card }: { card: NumberCard }) {
  return (
    <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="font-heading text-6xl sm:text-7xl text-gold leading-none">{card.number}</div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-foreground/60">{card.name}</div>
            <div className="text-sm text-foreground/85 mt-1 whitespace-pre-line">{card.meaning}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NumberCardView({ card, highlight }: { card: NumberCard; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-gold/40' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{card.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className={`font-heading text-4xl leading-none ${highlight ? 'text-gold' : 'text-foreground'}`}>{card.number}</div>
          <p className="text-xs text-foreground/75">{card.meaning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
