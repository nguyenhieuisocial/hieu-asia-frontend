'use client';

/**
 * Hành trình 5 lăng kính — personal progress page.
 *
 * Shows the user's progress across the 5 flagship lenses (Tử Vi · Bát Tự ·
 * MBTI · Big Five · Xem Tướng) as a 5-pointed star whose points light gold per
 * completed lens. Per-lens cards offer "Xem lại" (done) or "Soi ngay" (todo).
 * A locked "Chân dung hợp nhất" unlocks at 5/5 and bridges to the AI Mentor,
 * which fuses every lens into one portrait.
 *
 * Completion is derived from REAL client-side signals (see lib/journey.ts) —
 * never a hardcoded count. The 5 lenses come from the catalog single source of
 * truth (lib/catalog/lenses.ts). Faithful to trang-hanh-trinh-preview.html.
 */

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import { JourneyStar } from '@/components/account/JourneyStar';
import { getJourneyState, countDone, type JourneyLens } from '@/lib/journey';
import { LENS_COUNT } from '@/lib/catalog/lenses';

export default function JourneyPage() {
  const auth = useAuth();

  // Real completion is read on mount (localStorage is client-only). Pre-hydrate
  // we render the all-todo skeleton so SSR and first client paint agree.
  const [state, setState] = React.useState<JourneyLens[]>([]);
  React.useEffect(() => {
    setState(getJourneyState());
  }, []);

  if (!auth.loading && !auth.user) {
    // Soft gate — this is a personal page. Prompt sign-in rather than redirect
    // so a shared /account/journey link previews instead of bouncing.
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main id="main-content" className="pt-16">
          <div className="mx-auto max-w-md px-6 py-24 text-center">
            <p className="font-mono text-eyebrow uppercase tracking-[0.32em] text-gold-700">
              HÀNH TRÌNH CỦA BẠN
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold text-foreground">
              Đăng nhập để xem hành trình
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Ngôi sao 5 lăng kính của bạn được lưu theo tài khoản.
            </p>
            <Link
              href={'/signin?next=' + encodeURIComponent('/account/journey')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/[0.08] px-5 py-3 font-mono text-sm text-foreground transition hover:border-gold/70 hover:bg-gold/[0.13]"
            >
              Đăng nhập <ArrowRight className="h-4 w-4 text-gold" aria-hidden />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const done = countDone(state);
  const total = LENS_COUNT;
  const remaining = total - done;
  const allLit = done === total;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
        />

        <section className="relative mx-auto max-w-4xl px-6 pb-24 pt-12 sm:pt-16">
          {/* Hero: count copy on the left, the star on the right. */}
          <div className="grid items-center gap-10 sm:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <p className="flex items-center gap-2.5 font-mono text-eyebrow uppercase tracking-[0.32em] text-gold-700">
                <span aria-hidden className="h-px w-6 bg-gold-700" />
                HÀNH TRÌNH CỦA BẠN
              </p>
              <h1 className="mt-4 font-heading text-section-display font-bold tracking-tight text-foreground">
                {allLit ? (
                  <>
                    Ngôi sao của bạn đã <em className="not-italic text-gold">sáng trọn</em> 5 cánh
                  </>
                ) : (
                  <>
                    Ngôi sao của bạn đã sáng{' '}
                    <em className="not-italic text-gold">
                      {done} trên {total}
                    </em>{' '}
                    cánh
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-xl text-body-large text-muted-foreground">
                Mỗi lăng kính bạn hoàn thành thắp sáng một cánh sao — và cho AI
                Mentor thêm một góc nhìn để hiểu bạn. Soi đủ năm, chân dung hợp
                nhất sẽ mở.
              </p>

              <div className="mt-6">
                <p className="font-mono text-sm text-muted-foreground">
                  <b className="text-base text-gold">{done}</b> / {total} lăng kính
                  {remaining > 0
                    ? ` · còn ${remaining} để trọn ngôi sao`
                    : ' · trọn vẹn'}
                </p>
                <div
                  className="mt-2 h-1.5 max-w-sm overflow-hidden rounded-full bg-gold/15"
                  role="progressbar"
                  aria-valuenow={done}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-label="Số lăng kính đã soi"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-700 to-gold transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center sm:order-last">
              <JourneyStar state={state} done={done} total={total} />
            </div>
          </div>

          {/* Per-lens cards. */}
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {state.map((s) => (
              <li key={s.lens.slug}>
                <LensCard data={s} />
              </li>
            ))}
          </ul>

          {/* Locked / unlocked "Chân dung hợp nhất" → AI Mentor. */}
          <div
            className={`mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-7 sm:p-8 ${
              allLit
                ? 'border-gold/45 bg-gold/[0.08]'
                : 'border-border bg-card/40 opacity-90'
            }`}
          >
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                {allLit ? (
                  <Check className="h-5 w-5 text-gold" aria-hidden />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
                )}
                Chân dung hợp nhất
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {allLit ? '· đã mở' : '· còn khóa'}
                </span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {allLit
                  ? 'Bạn đã soi đủ năm lăng kính. AI Mentor giờ có thể hợp nhất Tử Vi, Bát Tự, MBTI, Big Five và Tướng thành một bức tranh — và một lời khuyên khi bạn phân vân.'
                  : 'Hoàn thành cả 5 lăng kính để mở “một bức tranh” — nơi AI hợp nhất Tử Vi, Bát Tự, MBTI, Big Five và Tướng thành một chân dung & lời khuyên khi bạn phân vân.'}
              </p>
            </div>
            {allLit ? (
              <Link
                href="/account/mentor"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gold bg-gold px-6 py-3.5 font-mono text-sm text-background transition hover:opacity-90"
              >
                Mở chân dung hợp nhất
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-6 py-3.5 font-mono text-sm text-muted-foreground">
                Còn {remaining} lăng kính
              </span>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function LensCard({ data }: { data: JourneyLens }) {
  const { lens, done, note, actionHref, reviewHref } = data;
  return (
    <div
      className={`relative h-full rounded-xl border p-4 ${
        done ? 'border-gold/45 bg-card/60' : 'border-border bg-card/25'
      }`}
    >
      {done && (
        <span
          aria-hidden
          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-gold text-background"
        >
          <Check className="h-3 w-3" />
        </span>
      )}
      <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-gold-700">
        {lens.eyebrow}
      </p>
      <h3 className="mt-1.5 font-heading text-lg text-foreground">{lens.name}</h3>
      {done ? (
        <>
          <p className="mt-1.5 font-mono text-[10.5px] text-gold-700">
            Đã soi{note ? ` · ${note}` : ''}
          </p>
          <Link
            href={reviewHref}
            className="mt-3 inline-flex items-center gap-1 border-b border-gold pb-px font-mono text-[11px] text-foreground transition hover:text-gold"
          >
            Xem lại <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </>
      ) : (
        <>
          <p className="mt-1.5 font-mono text-[10.5px] text-muted-foreground">
            Chưa soi
          </p>
          <Link
            href={actionHref}
            className="mt-3 inline-flex items-center gap-1 border-b border-gold pb-px font-mono text-[11px] text-foreground transition hover:text-gold"
          >
            Soi ngay <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </>
      )}
    </div>
  );
}
