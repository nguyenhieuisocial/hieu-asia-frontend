'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

interface ProfileForm {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
}

interface PairChemistryScore {
  dimension: string;
  score: number;
  signal: 'thuận' | 'trung tính' | 'cần chú ý';
  note: string;
}

interface PairCommunicationTip {
  vulnerability: string;
  reframe: string;
  suggestedPhrase: string;
}

interface CompatibilityPairReport {
  profileA: { display: string; zodiac: string };
  profileB: { display: string; zodiac: string };
  overallScore: number;
  summary: string;
  scores: PairChemistryScore[];
  communication: PairCommunicationTip[];
  caveats: string[];
}

const EMPTY: ProfileForm = { name: '', birthDate: '', birthTime: '', gender: 'male' };

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'So sánh 2 người', item: 'https://hieu.asia/compatibility' },
  ],
};

function ProfileFieldset({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: ProfileForm;
  onChange: (next: ProfileForm) => void;
  prefix: string;
}) {
  return (
    <Card className="border-cream/10 bg-ink/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-cream">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-name`} className="text-cream/85">
            Tên gọi (tùy chọn)
          </Label>
          <Input
            id={`${prefix}-name`}
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="Ví dụ: Lan"
            className="bg-ink/60"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-date`} className="text-cream/85">
            Ngày sinh<span className="text-rose-400"> *</span>
          </Label>
          <Input
            id={`${prefix}-date`}
            type="date"
            value={value.birthDate}
            onChange={(e) => onChange({ ...value, birthDate: e.target.value })}
            required
            className="bg-ink/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-time`} className="text-cream/85">
            Giờ sinh (tùy chọn)
          </Label>
          <Input
            id={`${prefix}-time`}
            type="time"
            value={value.birthTime}
            onChange={(e) => onChange({ ...value, birthTime: e.target.value })}
            className="bg-ink/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-cream/85">
            Giới tính<span className="text-rose-400"> *</span>
          </Label>
          <RadioGroup
            name={`${prefix}-gender`}
            value={value.gender}
            onValueChange={(v) => onChange({ ...value, gender: v as 'male' | 'female' })}
            className="flex gap-4"
          >
            <label className="flex items-center gap-2 text-sm text-cream/85">
              <RadioGroupItem value="male" id={`${prefix}-male`} />
              <span>Nam</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-cream/85">
              <RadioGroupItem value="female" id={`${prefix}-female`} />
              <span>Nữ</span>
            </label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ score, signal }: { score: number; signal: PairChemistryScore['signal'] }) {
  const pct = Math.max(8, Math.min(100, score * 10));
  const color =
    signal === 'thuận'
      ? 'bg-emerald-500/80'
      : signal === 'cần chú ý'
        ? 'bg-rose-500/80'
        : 'bg-gold/80';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-cream/10">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CompatibilityPage() {
  const [a, setA] = React.useState<ProfileForm>(EMPTY);
  const [b, setB] = React.useState<ProfileForm>({ ...EMPTY, gender: 'female' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<CompatibilityPairReport | null>(null);

  function payloadOf(p: ProfileForm) {
    const out: Record<string, unknown> = {
      birthDate: p.birthDate,
      gender: p.gender,
    };
    if (p.name.trim()) out.name = p.name.trim();
    if (p.birthTime) out.birthTime = p.birthTime;
    return out;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!a.birthDate || !b.birthDate) {
      setError('Cần ngày sinh của cả hai người.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/compatibility-pair`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ a: payloadOf(a), b: payloadOf(b) }),
      });
      const parsed = await safeJson<
        | { ok: true; report: CompatibilityPairReport }
        | { ok: false; error?: string }
      >(res);
      if (!parsed.ok) {
        setError(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      } else {
        const data = parsed.data;
        if (!data.ok) {
          setError(data.error ?? 'Có lỗi xảy ra, thử lại sau.');
        } else {
          setReport(data.report);
        }
      }
    } catch {
      setError('Không kết nối được máy chủ. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <ToolPageShell
        eyebrow="So sánh 2 người · Compatibility Pair"
        icon={<span aria-hidden="true">🤝</span>}
        title={
          <>
            So sánh <GoldAccent>2 người</GoldAccent>
          </>
        }
        description="So sánh hai người — không phải để khẳng định 'hợp/khắc', mà để hiểu vùng giao tiếp dễ trục trặc và cách điều chỉnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'So sánh 2 người' },
        ]}
      >
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileFieldset label="Người A" prefix="a" value={a} onChange={setA} />
            <ProfileFieldset label="Người B" prefix="b" value={b} onChange={setB} />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Đang phân tích...' : 'Phân tích tương hợp →'}
          </Button>
        </form>

        {!report && !loading && (
          <p className="mt-10 rounded-md border border-cream/10 bg-ink/40 px-4 py-6 text-center text-sm text-cream/55">
            Nhập thông tin hai người và bấm phân tích để xem 5 chiều cộng hưởng + gợi ý giao tiếp.
          </p>
        )}

        {report && (
          <section className="mt-10 space-y-8">
            <Card className="border-gold/30 bg-ink/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-cream">
                  {report.profileA.display} ({report.profileA.zodiac}) × {report.profileB.display} ({report.profileB.zodiac})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-heading text-4xl text-gold"
                    aria-label={`Điểm tổng ${report.overallScore} trên 10`}
                  >
                    {report.overallScore}
                    <span className="ml-1 text-sm text-cream/60">/10</span>
                  </div>
                  <p className="text-sm leading-relaxed text-cream/80">{report.summary}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Năm chiều cộng hưởng
              </h2>
              <div className="space-y-4">
                {report.scores.map((s) => (
                  <div
                    key={s.dimension}
                    className="rounded-xl border border-cream/10 bg-ink/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-cream">{s.dimension}</div>
                        <div className="text-xs text-cream/55">{s.signal}</div>
                      </div>
                      <div className="font-heading text-2xl text-cream">{s.score}<span className="text-sm text-cream/70">/10</span></div>
                    </div>
                    <div className="mt-3">
                      <ScoreBar score={s.score} signal={s.signal} />
                    </div>
                    <p className="mt-2 text-xs text-cream/70">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Gợi ý giao tiếp
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {report.communication.map((tip, i) => (
                  <Card key={i} className="border-cream/10 bg-ink/40 backdrop-blur-sm">
                    <CardContent className="space-y-3 pt-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-rose-300/80">
                          Dễ trục trặc
                        </div>
                        <p className="mt-1 text-sm text-cream/85">{tip.vulnerability}</p>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                          Cách diễn đạt lại
                        </div>
                        <p className="mt-1 text-sm text-cream/85">{tip.reframe}</p>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gold/80">
                          Thử nói
                        </div>
                        <p className="mt-1 rounded-md border border-gold/20 bg-gold/5 px-3 py-2 text-sm italic text-cream/90">
                          {tip.suggestedPhrase}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <footer className="rounded-md border border-cream/10 bg-ink/30 px-4 py-3 text-xs text-cream/55">
              <p className="mb-1 font-semibold text-cream/70">Lưu ý:</p>
              <ul className="list-disc space-y-1 pl-5">
                {report.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </footer>
          </section>
        )}
      </ToolPageShell>
    </>
  );
}
