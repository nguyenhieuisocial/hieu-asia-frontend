'use client';

import * as React from 'react';
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
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

const MIN_MEMBERS = 3;
const MAX_MEMBERS = 6;

type Gender = 'male' | 'female';

interface MemberForm {
  name: string;
  birthDate: string;
  gender: Gender;
}

const emptyMember = (gender: Gender = 'male'): MemberForm => ({
  name: '',
  birthDate: '',
  gender,
});

type Signal = 'thuận' | 'trung tính' | 'cần chú ý';

interface GroupMember {
  index: number;
  display: string;
  zodiac: string;
  avgScore: number;
  role: string;
}
interface GroupPair {
  aIndex: number;
  bIndex: number;
  aDisplay: string;
  bDisplay: string;
  score: number;
  signal: Signal;
  weakest: string;
  note: string;
}
interface CommunicationTip {
  vulnerability: string;
  reframe: string;
  suggestedPhrase: string;
}
interface GroupFriction {
  pair: GroupPair;
  tip: CommunicationTip;
}
interface GroupReport {
  size: number;
  groupScore: number;
  summary: string;
  members: GroupMember[];
  pairs: GroupPair[];
  harmony?: GroupPair;
  friction: GroupFriction[];
  caveats: string[];
}

function signalBar(signal: Signal): string {
  return signal === 'thuận'
    ? 'bg-emerald-500/80'
    : signal === 'cần chú ý'
      ? 'bg-rose-500/80'
      : 'bg-gold/80';
}

function ScoreBar({ score, signal }: { score: number; signal: Signal }) {
  const pct = Math.max(8, Math.min(100, score * 10));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/10">
      <div className={`h-full ${signalBar(signal)} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function MemberFieldset({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  value: MemberForm;
  onChange: (next: MemberForm) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const prefix = `m${index}`;
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="font-heading text-base text-foreground">
          Thành viên {index + 1}
        </CardTitle>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
            aria-label={`Bỏ thành viên ${index + 1}`}
          >
            Bỏ
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-name`} className="text-foreground/85">
            Tên gọi (tùy chọn)
          </Label>
          <Input
            id={`${prefix}-name`}
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder={`Ví dụ: ${['Ba', 'Mẹ', 'Anh', 'Em', 'Bạn', 'Tôi'][index] ?? 'Thành viên'}`}
            className="bg-card/60"
            autoComplete="off"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${prefix}-date`} className="text-foreground/85">
              Ngày sinh<span className="text-rose-400"> *</span>
            </Label>
            <Input
              id={`${prefix}-date`}
              type="date"
              value={value.birthDate}
              onChange={(e) => onChange({ ...value, birthDate: e.target.value })}
              required
              className="bg-card/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground/85">
              Giới tính<span className="text-rose-400"> *</span>
            </Label>
            <RadioGroup
              name={`${prefix}-gender`}
              value={value.gender}
              onValueChange={(v) => onChange({ ...value, gender: v as Gender })}
              className="flex gap-4 pt-1.5"
            >
              <label className="flex items-center gap-2 text-sm text-foreground/85">
                <RadioGroupItem value="male" id={`${prefix}-male`} />
                <span>Nam</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground/85">
                <RadioGroupItem value="female" id={`${prefix}-female`} />
                <span>Nữ</span>
              </label>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function XemHopNhomPage() {
  const [members, setMembers] = React.useState<MemberForm[]>([
    emptyMember('male'),
    emptyMember('female'),
    emptyMember('male'),
  ]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<GroupReport | null>(null);

  function updateMember(i: number, next: MemberForm) {
    setMembers((prev) => prev.map((m, idx) => (idx === i ? next : m)));
  }
  function addMember() {
    setMembers((prev) =>
      prev.length >= MAX_MEMBERS
        ? prev
        : [...prev, emptyMember(prev.length % 2 === 0 ? 'male' : 'female')],
    );
  }
  function removeMember(i: number) {
    setMembers((prev) => (prev.length <= MIN_MEMBERS ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (members.some((m) => !m.birthDate)) {
      setError('Cần ngày sinh của tất cả thành viên.');
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const payload = {
        profiles: members.map((m) => {
          const out: Record<string, unknown> = { birthDate: m.birthDate, gender: m.gender };
          if (m.name.trim()) out.name = m.name.trim();
          return out;
        }),
      };
      const res = await fetch(`${API_BASE}/tools/compatibility-group`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const parsed = await safeJson<
        { ok: true; report: GroupReport } | { ok: false; error?: string }
      >(res);
      if (!parsed.ok) {
        setError(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      } else if (!parsed.data.ok) {
        setError(parsed.data.error ?? 'Có lỗi xảy ra, thử lại sau.');
      } else {
        setReport(parsed.data.report);
        track('tool_used', { tool: 'xem-hop-nhom', result: 'ok', size: parsed.data.report.size });
      }
    } catch {
      setError('Không kết nối được máy chủ. Thử lại sau.');
      track('tool_used', { tool: 'xem-hop-nhom', result: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const sortedPairs = report ? [...report.pairs].sort((a, b) => b.score - a.score) : [];

  return (
    <>
      <ToolPageShell
        eyebrow="So hợp nhóm · gia đình"
        icon={<span aria-hidden="true">👨‍👩‍👧‍👦</span>}
        title={
          <>
            Xem hợp <GoldAccent>cả nhóm</GoldAccent>
          </>
        }
        description="Thêm 3–6 người (gia đình, nhóm bạn, đội nhóm) để xem mức hoà hợp chung, cặp nào ăn ý, cặp nào dễ lệch sóng và gợi ý phối hợp — không phải để dán nhãn hợp/khắc."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem hợp nhóm' },
        ]}
      >
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((m, i) => (
              <MemberFieldset
                key={i}
                index={i}
                value={m}
                onChange={(next) => updateMember(i, next)}
                onRemove={() => removeMember(i)}
                canRemove={members.length > MIN_MEMBERS}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={members.length >= MAX_MEMBERS}
            >
              + Thêm người {members.length >= MAX_MEMBERS && '(tối đa 6)'}
            </Button>
            <span className="text-xs text-muted-foreground">
              {members.length}/{MAX_MEMBERS} người
            </span>
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
            {loading ? 'Đang phân tích...' : 'Phân tích cả nhóm →'}
          </Button>
        </form>

        {!report && !loading && (
          <p className="mt-10 rounded-md border border-border bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">
            Nhập ngày sinh của các thành viên rồi bấm phân tích để xem điểm hoà hợp nhóm, từng cặp,
            và những cặp nên chú ý giao tiếp.
          </p>
        )}

        {report && (
          <section className="mt-10 space-y-8">
            {/* Group score + summary */}
            <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
              />
              <CardContent className="relative flex flex-col items-center gap-4 p-6 sm:flex-row sm:p-8">
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-heading text-4xl text-gold"
                  role="img"
                  aria-label={`Điểm hoà hợp nhóm ${report.groupScore} trên 10`}
                >
                  {report.groupScore}
                  <span className="ml-1 text-sm text-muted-foreground">/10</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{report.summary}</p>
              </CardContent>
            </Card>

            {/* Members + roles */}
            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                Vai trò trong nhóm
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {report.members.map((m) => (
                  <div key={m.index} className="rounded-xl border border-border bg-card/40 p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-heading text-base text-foreground">{m.display}</span>
                      <span className="text-xs text-muted-foreground">{m.zodiac}</span>
                    </div>
                    <div className="mt-1 text-sm text-foreground/80">
                      Hợp nhịp trung bình:{' '}
                      <span className="font-semibold text-foreground">{m.avgScore}/10</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-gold-700">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pair matrix */}
            <div>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                Mức hợp từng cặp
              </h2>
              <div className="space-y-3">
                {sortedPairs.map((p) => (
                  <div
                    key={`${p.aIndex}-${p.bIndex}`}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-foreground">
                        {p.aDisplay} <span className="text-muted-foreground">×</span> {p.bDisplay}
                      </div>
                      <div className="font-heading text-xl text-foreground">
                        {p.score}
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ScoreBar score={p.score} signal={p.signal} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {p.signal} · {p.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Friction pairs + tips */}
            {report.friction.length > 0 && (
              <div>
                <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                  Cặp nên chú ý
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {report.friction.map((f) => (
                    <Card
                      key={`${f.pair.aIndex}-${f.pair.bIndex}`}
                      className="border-border bg-card/40 backdrop-blur-sm"
                    >
                      <CardHeader>
                        <CardTitle className="font-heading text-base text-foreground">
                          {f.pair.aDisplay} × {f.pair.bDisplay}
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            {f.pair.score}/10
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-rose-300/80">
                            Dễ trục trặc
                          </div>
                          <p className="mt-1 text-sm text-foreground/85">{f.tip.vulnerability}</p>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                            Cách nhìn lại
                          </div>
                          <p className="mt-1 text-sm text-foreground/85">{f.tip.reframe}</p>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-gold-700">
                            Thử nói
                          </div>
                          <p className="mt-1 rounded-md border border-gold/20 bg-gold/5 px-3 py-2 text-sm italic text-foreground/90">
                            {f.tip.suggestedPhrase}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1">
              <ShareResultButton
                path="/xem-hop-nhom"
                title="Xem hợp cả nhóm — hieu.asia"
                text={`Nhóm ${report.size} người của tôi hoà hợp ${report.groupScore}/10. Thử xem nhóm bạn xem sao?`}
                trackId="xem-hop-nhom"
              />
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
      <StickyMobileCta trackId="xem-hop-nhom" />
    </>
  );
}
