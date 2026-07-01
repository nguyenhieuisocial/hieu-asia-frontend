'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  RefreshCw,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { KARMIC_DEBT, KARMIC_LESSONS } from '@/lib/than-so-hoc-karmic';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

// Chỉ các số có trang chi tiết /than-so-hoc/y-nghia/so-N (1–9 + master 11/22/33).
// Số nợ nghiệp (13/14/16/19) hay ngày sinh thô KHÔNG có trang → trả null, không link.
const SO_PAGE_SET = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]);
const soDetailHref = (n: number): string | null =>
  SO_PAGE_SET.has(n) ? `/than-so-hoc/y-nghia/so-${n}` : null;

/** Format an ISO birth date (YYYY-MM-DD) as vi-VN DD/MM/YYYY; input on no-match. */
function formatVnDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

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
  /** Back-compat: first karmic debt (legacy). Prefer `karmic_debts`. */
  karmic_debt?: number;
  /** Every core position carrying a Karmic Debt (13/14/16/19). Added 2026-06-18. */
  karmic_debts?: { position: 'life_path' | 'expression' | 'soul_urge' | 'birthday'; number: number }[];
  master_numbers: number[];
  input: { birth_date: string; full_name: string; current_year: number };
}

const BREADCRUMB = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thần Số Học', href: '/than-so-hoc' },
  { label: 'Kết quả' },
];

export default function ThanSoHocResultPage() {
  const sp = useSearchParams();
  const fullName = sp.get('full_name') ?? '';
  const birthDate = sp.get('birth_date') ?? '';

  const [data, setData] = React.useState<ThanSoHocResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const trackedRef = React.useRef(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API_BASE}/tools/than-so-hoc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, birth_date: birthDate }),
      });
      const parsed = await safeJson<{ ok: boolean; result?: ThanSoHocResult; error?: string }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const json = parsed.data;
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tính được kết quả');
      setData(json.result);
      if (!trackedRef.current) {
        trackedRef.current = true;
        track('tool_used', { tool: 'than-so-hoc', result: 'ok' });
      }
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      track('tool_used', { tool: 'than-so-hoc', result: 'error' });
    } finally {
      setLoading(false);
    }
  }, [fullName, birthDate]);

  React.useEffect(() => {
    if (!fullName || !birthDate) {
      setError('Thiếu thông tin họ tên hoặc ngày sinh.');
      setLoading(false);
      return;
    }
    void load();
  }, [fullName, birthDate, load]);

  return (
    <ToolPageShell
      eyebrow="Thần Số Học · Pythagoras"
      icon={<span aria-hidden="true">🔢</span>}
      title={
        <>
          Bản đồ <GoldAccent>Thần Số Học</GoldAccent>
        </>
      }
      description={
        data
          ? `Phân tích cho ${data.input.full_name} · Sinh ngày ${formatVnDate(data.input.birth_date)}`
          : 'Phân tích con số chủ đạo theo phương pháp Pythagoras — đường đời, thiên hướng, linh hồn và chu kỳ đỉnh cao.'
      }
      breadcrumb={BREADCRUMB}
    >
      {loading && <ResultSkeleton />}

      {!loading && error && (
        <ErrorState message={error} onRetry={load} />
      )}

      {!loading && !error && data && (
        <div className="mt-6 space-y-6">
          <HeroLifePath card={data.life_path} year={data.personal_year.number} />

          {data.master_numbers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-medium text-gold-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Master Numbers: {data.master_numbers.join(', ')}
              </span>
            </div>
          )}

          <KarmicDebtSection debts={data.karmic_debts} fallback={data.karmic_debt} />

          <section>
            <SectionTitle>Hồ sơ số học cá nhân</SectionTitle>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <NumberCardView card={data.expression} />
              <NumberCardView card={data.soul_urge} />
              <NumberCardView card={data.personality} />
              <NumberCardView card={data.birthday} />
              <NumberCardView card={data.maturity} />
              <NumberCardView card={data.personal_year} highlight />
            </div>
          </section>

          <section>
            <SectionTitle>Tháng cá nhân hiện tại</SectionTitle>
            <Card className="mt-3 border-border bg-card/50">
              <CardContent className="flex items-start gap-5 p-5">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-gold/10 font-heading text-2xl font-bold text-gold"
                >
                  {data.personal_month.number}
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-base font-semibold text-foreground">
                    {data.personal_month.name}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                    {data.personal_month.meaning}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <SectionTitle>4 chu kỳ đỉnh cao cuộc đời</SectionTitle>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.pinnacle_cycles.map((p) => (
                <div
                  key={p.index}
                  className="rounded-xl border border-border bg-card/40 p-4 transition hover:border-gold/30 active:scale-[0.98]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Đỉnh {p.index} · {p.age_range}
                  </div>
                  <div className="mt-2 font-heading text-3xl font-bold text-gold-700">{p.number}</div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>4 thử thách cuộc đời</SectionTitle>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.challenges.map((c) => (
                <div
                  key={c.index}
                  className="rounded-xl border border-border bg-card/40 p-4 transition hover:border-rose-400/30 active:scale-[0.98]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Thử thách {c.index}
                  </div>
                  <div className="mt-2 font-heading text-3xl font-bold text-rose-300">
                    {c.number}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          {data.karmic_lessons.length > 0 && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-base text-amber-200">
                  Bài học nghiệp (Karmic Lessons)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/80">
                  Những con số sau đây không xuất hiện trong tên bạn — theo phương pháp Pythagoras,
                  đó là các phẩm chất bạn chưa quen vận dụng và có thể chủ động rèn luyện. Đây là cơ
                  hội phát triển, không phải khiếm khuyết cố định:
                </p>
                <div className="mt-4 space-y-3">
                  {data.karmic_lessons.map((n) => {
                    const m = KARMIC_LESSONS[n];
                    if (!m) return null;
                    return (
                      <div
                        key={n}
                        className="flex items-start gap-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4"
                      >
                        <div
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 font-heading text-lg font-bold text-amber-200"
                        >
                          {n}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-relaxed text-amber-100">
                            {m.lesson}
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                            <span className="font-semibold text-amber-200/90">Cách rèn luyện: </span>
                            {m.how}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <ResultActions data={data} />

          <PremiumCta />
        </div>
      )}
    </ToolPageShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-lg font-semibold text-foreground sm:text-xl">{children}</h2>
  );
}

// Nhãn vị trí lõi mang nợ nghiệp — 4 vị trí đồng thuận (Goodwin ∩ Decoz).
// Nhân Cách (consonant-sum) bị loại có chủ đích: Goodwin không tính → tránh over-claim.
const KARMIC_POSITION_LABEL: Record<string, string> = {
  life_path: 'Đường Đời',
  expression: 'Vận Mệnh',
  soul_urge: 'Linh Hồn',
  birthday: 'Ngày Sinh',
};

function KarmicDebtCard({ debt, positions }: { debt: number; positions?: string[] }) {
  const m = KARMIC_DEBT[debt as 13 | 14 | 16 | 19];
  if (!m) return null;
  return (
    <Card className="border-rose-500/30 bg-rose-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base text-rose-200">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 font-heading text-lg font-bold text-rose-200"
          >
            {m.number}
          </span>
          {m.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {positions && positions.length > 0 && (
          <p className="mb-3 text-xs font-medium text-rose-200/80">
            Xuất hiện ở: {positions.join(' · ')}
          </p>
        )}
        <p className="text-sm leading-relaxed text-foreground/80">{m.theme}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          <span className="font-semibold text-rose-200/90">Hướng trưởng thành: </span>
          {m.growth}
        </p>
      </CardContent>
    </Card>
  );
}

// Render TẤT CẢ nợ nghiệp engine trả về (trước đây chỉ hiện 1). Gom theo con số vì
// cùng một số có thể xuất hiện ở nhiều vị trí lõi. Fallback `karmic_debt` (số lẻ) cho
// khoảng thời gian deploy lệch (backend cũ chưa trả `karmic_debts`).
function KarmicDebtSection({
  debts,
  fallback,
}: {
  debts?: { position: string; number: number }[];
  fallback?: number;
}) {
  const byNumber = new Map<number, string[]>();
  if (debts && debts.length > 0) {
    for (const d of debts) {
      const arr = byNumber.get(d.number) ?? [];
      const label = KARMIC_POSITION_LABEL[d.position];
      if (label) arr.push(label);
      byNumber.set(d.number, arr);
    }
  } else if (fallback) {
    byNumber.set(fallback, []);
  }
  if (byNumber.size === 0) return null;
  return (
    <div className="space-y-3">
      {Array.from(byNumber.entries()).map(([num, positions]) => (
        <KarmicDebtCard key={num} debt={num} positions={positions} />
      ))}
    </div>
  );
}

function HeroLifePath({ card, year }: { card: NumberCard; year: number }) {
  return (
    <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/10 via-card/60 to-gold/5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl"
      />
      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-col items-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
              Đường đời · Life Path
            </div>
            <div className="bg-gold-gradient bg-clip-text font-heading text-7xl font-extrabold leading-none text-transparent sm:text-8xl">
              {card.number}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
              {card.name}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85 sm:text-base">
              {card.meaning}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
              Năm cá nhân hiện tại · <span className="font-bold text-gold-700">{year}</span>
            </p>
            {soDetailHref(card.number) && (
              <div className="mt-3">
                <Link
                  href={soDetailHref(card.number)!}
                  className="inline-block text-sm font-semibold text-gold-700 hover:text-gold"
                >
                  Đọc sâu số chủ đạo {card.number} — tính cách, sự nghiệp, tình cảm →
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NumberCardView({ card, highlight }: { card: NumberCard; highlight?: boolean }) {
  return (
    <Card
      className={
        highlight
          ? 'border-gold/40 bg-gradient-to-br from-gold/10 to-transparent'
          : 'border-border bg-card/40 transition hover:border-gold/30 active:scale-[0.98]'
      }
    >
      <CardHeader className="pb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {card.name}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div
            className={
              'font-heading text-4xl font-bold leading-none ' +
              (highlight ? 'text-gold-700' : 'text-foreground')
            }
          >
            {card.number}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{card.meaning}</p>
        </div>
        {soDetailHref(card.number) && (
          <Link
            href={soDetailHref(card.number)!}
            className="mt-3 inline-block text-xs font-semibold text-gold-700 hover:text-gold"
          >
            Đọc sâu số {card.number} →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function ResultActions({ data }: { data: ThanSoHocResult }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    const lines = [
      `Bản đồ Thần Số Học — ${data.input.full_name}`,
      `Sinh ngày: ${formatVnDate(data.input.birth_date)}`,
      `Đường đời: ${data.life_path.number} (${data.life_path.name})`,
      `Số biểu đạt: ${data.expression.number} · Linh hồn: ${data.soul_urge.number} · Tính cách: ${data.personality.number}`,
      `Năm cá nhân ${data.input.current_year}: ${data.personal_year.number}`,
      '',
      'Xem chi tiết tại: https://hieu.asia/than-so-hoc',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      track('share_clicked', { network: 'copy_link', surface: 'than-so-hoc-result' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const onShare = async () => {
    if (typeof navigator === 'undefined' || !('share' in navigator)) {
      void onCopy();
      return;
    }
    try {
      await navigator.share({
        title: 'Bản đồ Thần Số Học của tôi',
        text: `Đường đời ${data.life_path.number} · ${data.life_path.name}`,
        url: typeof window !== 'undefined' ? window.location.href : 'https://hieu.asia/than-so-hoc',
      });
      track('share_clicked', { network: 'copy_link', surface: 'than-so-hoc-result' });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Lưu lại kết quả để chia sẻ — hoặc đặt báo cáo chi tiết theo chiêm tinh, Tử Vi, MBTI.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onCopy}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Đã chép
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Sao chép
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Chia sẻ
        </Button>
        <DownloadToolPdfButton
          source="pdf-than-so-hoc"
          payload={() => {
            if (!data) return null;

            const coreRows: NonNullable<ToolPdfPayload['sections'][number]['rows']> = [
              { label: data.life_path.name, value: String(data.life_path.number) },
              { label: data.expression.name, value: String(data.expression.number) },
              { label: data.soul_urge.name, value: String(data.soul_urge.number) },
              { label: data.personality.name, value: String(data.personality.number) },
              { label: data.birthday.name, value: String(data.birthday.number) },
              { label: data.maturity.name, value: String(data.maturity.number) },
              { label: data.personal_year.name, value: String(data.personal_year.number) },
              { label: data.personal_month.name, value: String(data.personal_month.number) },
            ];

            const sections: ToolPdfPayload['sections'] = [
              { heading: 'Hồ sơ số học cá nhân', rows: coreRows },
              {
                heading: `${data.life_path.name} (số ${data.life_path.number})`,
                text: data.life_path.meaning,
              },
              {
                heading: `${data.expression.name} (số ${data.expression.number})`,
                text: data.expression.meaning,
              },
              {
                heading: `${data.soul_urge.name} (số ${data.soul_urge.number})`,
                text: data.soul_urge.meaning,
              },
              {
                heading: `${data.personality.name} (số ${data.personality.number})`,
                text: data.personality.meaning,
              },
              {
                heading: `${data.birthday.name} (số ${data.birthday.number})`,
                text: data.birthday.meaning,
              },
              {
                heading: `${data.maturity.name} (số ${data.maturity.number})`,
                text: data.maturity.meaning,
              },
              {
                heading: `${data.personal_year.name} (số ${data.personal_year.number})`,
                text: data.personal_year.meaning,
              },
              {
                heading: `${data.personal_month.name} (số ${data.personal_month.number})`,
                text: data.personal_month.meaning,
              },
            ];

            if (data.master_numbers.length > 0) {
              sections.push({
                heading: 'Số bậc thầy (Master Numbers)',
                text: data.master_numbers.join(', '),
              });
            }

            if (data.pinnacle_cycles.length > 0) {
              sections.push({
                heading: '4 chu kỳ đỉnh cao cuộc đời',
                rows: data.pinnacle_cycles.map((p) => ({
                  label: `Đỉnh ${p.index} · ${p.age_range}`,
                  value: String(p.number),
                })),
              });
              for (const p of data.pinnacle_cycles) {
                sections.push({
                  heading: `Đỉnh ${p.index} · ${p.age_range} (số ${p.number})`,
                  text: p.meaning,
                });
              }
            }

            if (data.challenges.length > 0) {
              sections.push({
                heading: '4 thử thách cuộc đời',
                rows: data.challenges.map((c) => ({
                  label: `Thử thách ${c.index}`,
                  value: String(c.number),
                })),
              });
              for (const c of data.challenges) {
                sections.push({
                  heading: `Thử thách ${c.index} (số ${c.number})`,
                  text: c.meaning,
                });
              }
            }

            const lessonRows = data.karmic_lessons
              .map((n) => {
                const m = KARMIC_LESSONS[n];
                return m ? { label: `Số ${n}`, value: m.lesson } : null;
              })
              .filter((r): r is { label: string; value: string } => r !== null);
            if (lessonRows.length > 0) {
              sections.push({ heading: 'Bài học nghiệp (Karmic Lessons)', rows: lessonRows });
            }

            return {
              title: 'Bản đồ Thần Số Học — hieu.asia',
              subtitle: `${data.input.full_name} · Sinh ngày ${formatVnDate(data.input.birth_date)}`,
              hero: {
                big: String(data.life_path.number),
                small: `${data.life_path.name} · Năm cá nhân ${data.input.current_year}: ${data.personal_year.number}`,
              },
              sections,
            };
          }}
        />
        <Button asChild variant="ghost" size="sm"><Link href="/than-so-hoc">
          
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Tính số khác
          
        </Link></Button>
      </div>
    </div>
  );
}

function PremiumCta() {
  const onClick = () => {
    track('cta_clicked', {
      cta_id: 'than-so-hoc-result-pricing',
      page: '/than-so-hoc/result',
    });
  };
  return (
    <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/15 via-card/40 to-gold/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
      />
      <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
            <Crown className="h-3 w-3" aria-hidden="true" /> Premium
          </div>
          <h3 className="mt-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">
            Đặt báo cáo <GoldAccent>chi tiết</GoldAccent>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Kết hợp Tử Vi · Bát Tự · MBTI và phân tích chỉ tay — báo cáo dài 15-20 trang,
            đi kèm chat với AI Mentor không giới hạn.
          </p>
        </div>
        <Button asChild size="lg"><Link href="/pricing?from=than-so-hoc" onClick={onClick} className="shrink-0">
          Xem các gói báo cáo →
        </Link></Button>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="mt-6 border-rose-500/30 bg-rose-500/5">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div aria-hidden className="text-5xl">⚠️</div>
        <h2 className="mt-4 font-heading text-lg text-foreground">Không tải được kết quả</h2>
        <p className="mt-2 max-w-md text-sm text-rose-200">{message}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onRetry} size="sm">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Thử lại
          </Button>
          <Button asChild variant="outline" size="sm"><Link href="/than-so-hoc">
            
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Quay lại form
            
          </Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      <Card className="border-border bg-card/40">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Skeleton className="h-24 w-24 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}
