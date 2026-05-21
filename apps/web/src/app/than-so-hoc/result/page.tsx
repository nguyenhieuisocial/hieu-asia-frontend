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
import { track } from '@/lib/analytics';

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
      const json = (await res.json()) as { ok: boolean; result?: ThanSoHocResult; error?: string };
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
      eyebrow="Numerology · Pythagoras"
      icon={<span aria-hidden="true">🔢</span>}
      title={
        <>
          Bản đồ <GoldAccent>Thần Số Học</GoldAccent>
        </>
      }
      description={
        data
          ? `Phân tích cho ${data.input.full_name} · Sinh ngày ${data.input.birth_date}`
          : 'Phân tích con số định mệnh theo phương pháp Pythagoras — đường đời, vận mệnh, linh hồn và chu kỳ đỉnh cao.'
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

          {(data.master_numbers.length > 0 || data.karmic_debt) && (
            <div className="flex flex-wrap items-center gap-2">
              {data.master_numbers.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Master Numbers: {data.master_numbers.join(', ')}
                </span>
              )}
              {data.karmic_debt && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
                  Nợ nghiệp: {data.karmic_debt}
                </span>
              )}
            </div>
          )}

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
            <Card className="mt-3 border-cream/10 bg-ink/50">
              <CardContent className="flex items-start gap-5 p-5">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 via-ink to-purple/20 font-heading text-2xl font-bold text-gold"
                >
                  {data.personal_month.number}
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-base font-semibold text-cream">
                    {data.personal_month.name}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-cream/80">
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
                  className="rounded-xl border border-cream/10 bg-ink/40 p-4 transition-colors hover:border-gold/30"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/55">
                    Đỉnh {p.index} · {p.age_range}
                  </div>
                  <div className="mt-2 font-heading text-3xl font-bold text-gold">{p.number}</div>
                  <p className="mt-2 text-xs leading-relaxed text-cream/75">{p.meaning}</p>
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
                  className="rounded-xl border border-cream/10 bg-ink/40 p-4 transition-colors hover:border-rose-400/30"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/55">
                    Thử thách {c.index}
                  </div>
                  <div className="mt-2 font-heading text-3xl font-bold text-rose-300">
                    {c.number}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-cream/75">{c.meaning}</p>
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
                <p className="text-sm leading-relaxed text-cream/80">
                  Những con số sau đây không xuất hiện trong tên bạn. Đây là các bài học cuộc đời
                  bạn cần hoàn thiện:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.karmic_lessons.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200"
                    >
                      Số {n}
                    </span>
                  ))}
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
    <h2 className="font-heading text-lg font-semibold text-cream sm:text-xl">{children}</h2>
  );
}

function HeroLifePath({ card, year }: { card: NumberCard; year: number }) {
  return (
    <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/10 via-ink/40 to-purple/15">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-purple/30 blur-3xl"
      />
      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-col items-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
              Đường đời · Life Path
            </div>
            <div className="bg-gold-gradient bg-clip-text font-heading text-7xl font-extrabold leading-none text-transparent sm:text-8xl">
              {card.number}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-xl font-semibold text-cream sm:text-2xl">
              {card.name}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cream/85 sm:text-base">
              {card.meaning}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-ink/40 px-3 py-1 font-mono text-[11px] tracking-wide text-cream/70">
              Năm cá nhân hiện tại · <span className="font-bold text-gold">{year}</span>
            </p>
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
          : 'border-cream/10 bg-ink/40 transition-colors hover:border-gold/30'
      }
    >
      <CardHeader className="pb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/55">
          {card.name}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div
            className={
              'font-heading text-4xl font-bold leading-none ' +
              (highlight ? 'text-gold' : 'text-cream')
            }
          >
            {card.number}
          </div>
          <p className="text-xs leading-relaxed text-cream/75">{card.meaning}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultActions({ data }: { data: ThanSoHocResult }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    const lines = [
      `Bản đồ Thần Số Học — ${data.input.full_name}`,
      `Sinh ngày: ${data.input.birth_date}`,
      `Đường đời: ${data.life_path.number} (${data.life_path.name})`,
      `Vận mệnh: ${data.expression.number} · Linh hồn: ${data.soul_urge.number} · Tính cách: ${data.personality.number}`,
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
    <div className="flex flex-col gap-3 rounded-xl border border-cream/10 bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-cream/65">
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
        <Link href="/than-so-hoc">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Tính số khác
          </Button>
        </Link>
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
    <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-purple/20 via-ink/60 to-gold/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
      />
      <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            <Crown className="h-3 w-3" aria-hidden="true" /> Premium
          </div>
          <h3 className="mt-2 font-heading text-xl font-semibold text-cream sm:text-2xl">
            Đặt báo cáo <GoldAccent>chi tiết</GoldAccent>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/75">
            Kết hợp Tử Vi · Bát Tự · MBTI và phân tích chỉ tay — báo cáo dài 15-20 trang,
            đi kèm chat với AI Mentor không giới hạn.
          </p>
        </div>
        <Link href="/pricing?from=than-so-hoc" onClick={onClick} className="shrink-0">
          <Button size="lg">Xem các gói báo cáo →</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="mt-6 border-rose-500/30 bg-rose-500/5">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div aria-hidden className="text-5xl">⚠️</div>
        <h2 className="mt-4 font-heading text-lg text-cream">Không tải được kết quả</h2>
        <p className="mt-2 max-w-md text-sm text-rose-200">{message}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onRetry} size="sm">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Thử lại
          </Button>
          <Link href="/than-so-hoc">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Quay lại form
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      <Card className="border-cream/10 bg-ink/40">
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
