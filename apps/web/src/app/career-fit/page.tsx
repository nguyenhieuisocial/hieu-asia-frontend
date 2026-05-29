'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

type AutonomyLevel = 'low' | 'medium' | 'high';
type RiskAppetite = 'low' | 'medium' | 'high';
type SocialIntensity = 'solo' | 'team' | 'large_org';
type CreativityLevel = 'low' | 'medium' | 'high';
type StructurePreference = 'rigid' | 'flexible' | 'chaotic_ok';

interface CareerMatch {
  category: string;
  examples: string[];
  fitScore: number;
  rationale: string;
  watchOut: string;
}

interface CareerFitReport {
  topMatches: CareerMatch[];
  allCategories: CareerMatch[];
  elementOfZodiac: string;
  summary: string;
  caveats: string[];
}

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Career Fit', item: 'https://hieu.asia/career-fit' },
  ],
};

const PREF_GROUPS: {
  key: 'autonomyLevel' | 'riskAppetite' | 'socialIntensity' | 'creativityLevel' | 'structurePreference';
  label: string;
  helper: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: 'autonomyLevel',
    label: 'Mức tự chủ bạn muốn',
    helper: 'Bạn muốn ai chỉ đạo công việc hằng ngày tới mức nào?',
    options: [
      { value: 'low', label: 'Có người dẫn dắt' },
      { value: 'medium', label: 'Vừa đủ' },
      { value: 'high', label: 'Tự chủ tối đa' },
    ],
  },
  {
    key: 'riskAppetite',
    label: 'Mức chấp nhận rủi ro',
    helper: 'Thu nhập biến động vs ổn định.',
    options: [
      { value: 'low', label: 'Thấp — cần ổn định' },
      { value: 'medium', label: 'Trung bình' },
      { value: 'high', label: 'Cao — đổi lấy upside' },
    ],
  },
  {
    key: 'socialIntensity',
    label: 'Cường độ giao tiếp',
    helper: 'Bạn làm việc tốt nhất một mình, theo nhóm, hay trong tổ chức lớn?',
    options: [
      { value: 'solo', label: 'Một mình' },
      { value: 'team', label: 'Nhóm nhỏ' },
      { value: 'large_org', label: 'Tổ chức lớn' },
    ],
  },
  {
    key: 'creativityLevel',
    label: 'Mức sáng tạo',
    helper: 'Công việc cần bạn nghĩ ra cái mới tới đâu?',
    options: [
      { value: 'low', label: 'Thấp — theo chuẩn' },
      { value: 'medium', label: 'Trung bình' },
      { value: 'high', label: 'Cao — sáng tạo là cốt' },
    ],
  },
  {
    key: 'structurePreference',
    label: 'Mức cấu trúc bạn thích',
    helper: 'Quy trình chặt vs linh hoạt vs hỗn loạn ok.',
    options: [
      { value: 'rigid', label: 'Chặt chẽ' },
      { value: 'flexible', label: 'Linh hoạt' },
      { value: 'chaotic_ok', label: 'Hỗn loạn cũng ok' },
    ],
  },
];

function FitBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : score >= 5
        ? 'border-gold/40 bg-gold/10 text-gold-700'
        : 'border-rose-500/40 bg-rose-500/10 text-rose-300';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}
    >
      {score}/10
    </span>
  );
}

export default function CareerFitPage() {
  const [birthDate, setBirthDate] = React.useState('');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');
  const [autonomyLevel, setAutonomyLevel] = React.useState<AutonomyLevel>('medium');
  const [riskAppetite, setRiskAppetite] = React.useState<RiskAppetite>('medium');
  const [socialIntensity, setSocialIntensity] = React.useState<SocialIntensity>('team');
  const [creativityLevel, setCreativityLevel] = React.useState<CreativityLevel>('medium');
  const [structurePreference, setStructurePreference] = React.useState<StructurePreference>('flexible');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<CareerFitReport | null>(null);

  const prefState: Record<string, string> = {
    autonomyLevel,
    riskAppetite,
    socialIntensity,
    creativityLevel,
    structurePreference,
  };

  function setPref(key: string, value: string) {
    if (key === 'autonomyLevel') setAutonomyLevel(value as AutonomyLevel);
    else if (key === 'riskAppetite') setRiskAppetite(value as RiskAppetite);
    else if (key === 'socialIntensity') setSocialIntensity(value as SocialIntensity);
    else if (key === 'creativityLevel') setCreativityLevel(value as CreativityLevel);
    else if (key === 'structurePreference') setStructurePreference(value as StructurePreference);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!birthDate) {
      setError('Cần ngày sinh.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/career-fit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          gender,
          preferences: {
            autonomyLevel,
            riskAppetite,
            socialIntensity,
            creativityLevel,
            structurePreference,
          },
        }),
      });
      const parsed = await safeJson<
        | { ok: true; report: CareerFitReport }
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
        eyebrow="Career Fit · Định hướng nghề"
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            Career <GoldAccent>Fit</GoldAccent>
          </>
        }
        description="Khám phá nhóm công việc phù hợp với cách bạn vận hành, kết hợp khuynh hướng lá số và sở thích thực tế."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Career Fit' },
        ]}
      >
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cf-date" className="text-foreground/85">
                  Ngày sinh<span className="text-rose-400"> *</span>
                </Label>
                <Input
                  id="cf-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="bg-card/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/85">Giới tính</Label>
                <RadioGroup
                  name="cf-gender"
                  value={gender}
                  onValueChange={(v) => setGender(v as 'male' | 'female')}
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 text-sm text-foreground/85">
                    <RadioGroupItem value="male" id="cf-male" />
                    <span>Nam</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground/85">
                    <RadioGroupItem value="female" id="cf-female" />
                    <span>Nữ</span>
                  </label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground">Cách bạn vận hành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {PREF_GROUPS.map((g) => (
                <div key={g.key} className="space-y-2">
                  <Label className="text-foreground/85">{g.label}</Label>
                  <p className="text-xs text-muted-foreground">{g.helper}</p>
                  <RadioGroup
                    name={`cf-${g.key}`}
                    value={prefState[g.key]}
                    onValueChange={(v) => setPref(g.key, v)}
                    className="grid gap-2 sm:grid-cols-3"
                  >
                    {g.options.map((o) => (
                      <label
                        key={o.value}
                        className="flex items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-foreground/85 transition-colors hover:border-gold/30"
                      >
                        <RadioGroupItem value={o.value} id={`${g.key}-${o.value}`} />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Đang phân tích...' : 'Phân tích Career Fit →'}
          </Button>
        </form>

        {!report && !loading && (
          <p className="mt-10 rounded-md border border-border bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">
            Chọn 5 sở thích và bấm phân tích để xem top 3 nhóm công việc phù hợp.
          </p>
        )}

        {report && (
          <section className="mt-10 space-y-8">
            <Card className="border-gold/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-foreground/80">{report.summary}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Mệnh theo địa chi năm sinh: <span className="text-gold-700">{report.elementOfZodiac}</span>
                </p>
              </CardContent>
            </Card>

            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                Top 3 nhóm phù hợp
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {report.topMatches.map((m) => (
                  <Card key={m.category} className="border-border bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="font-heading text-base text-foreground">
                          {m.category}
                        </CardTitle>
                        <FitBadge score={m.fitScore} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                        {m.examples.map((ex) => (
                          <li key={ex}>{ex}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-foreground/80">{m.rationale}</p>
                      <p className="rounded-md border border-rose-500/20 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-200/85">
                        Cẩn trọng: {m.watchOut}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                Toàn bộ 5 nhóm — xếp hạng
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-card/40">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Nhóm</th>
                      <th className="px-4 py-2 text-right font-medium">Fit score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.allCategories.map((c, i) => (
                      <tr
                        key={c.category}
                        className={i % 2 === 0 ? 'bg-card/30' : ''}
                      >
                        <td className="px-4 py-2 text-foreground/85">{c.category}</td>
                        <td className="px-4 py-2 text-right">
                          <FitBadge score={c.fitScore} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="rounded-md border border-border bg-card/30 px-4 py-3 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-muted-foreground">Lưu ý:</p>
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
