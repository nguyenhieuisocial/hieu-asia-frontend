'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, CardContent, Textarea } from '@hieu-asia/ui';
import { Bot, Sparkles, AlertTriangle, Info, Send } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';

interface CronJobHealth {
  job: string;
  ok: boolean;
  ts: string;
  age_min: number | null;
  note?: string;
}
interface OpsSignals {
  kpis: Array<{ key: string; label: string; value: number | string | null }>;
  cron: { heartbeat_min: number | null; failing: CronJobHealth[]; total_jobs_with_history: number };
  ai_balance_usd: number | null;
  generated_at: string;
}
interface CopilotResult {
  ok: boolean;
  answer: string | null;
  ai_vendor: string | null;
  ai_fallback: boolean;
  ai_summary_disabled: boolean;
  signals: OpsSignals;
  generated_at: string;
  error?: string;
}

const SUGGESTIONS = [
  'Hệ thống hôm nay có ổn không?',
  'Có gì bất thường cần chú ý không?',
  'Tình hình đăng ký và lỗi 24h qua thế nào?',
  'Các tác vụ tự động có chạy đều không?',
];

async function askCopilot(question: string): Promise<CopilotResult> {
  const r = await fetch('/api/admin/copilot/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  const data = (await r.json()) as CopilotResult;
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

const fmtKpiVal = (v: number | string | null) =>
  v === null || v === undefined ? '—' : typeof v === 'number' ? v.toLocaleString('vi-VN') : String(v);

export default function CopilotPage() {
  const [question, setQuestion] = React.useState('');
  const mut = useMutation({ mutationFn: askCopilot });
  const result = mut.data;

  // Defensive: the worker always returns a full `signals`, but never let a
  // malformed/partial 200 response white-screen the page.
  const sig = result?.signals;
  const kpis = sig?.kpis ?? [];
  const failing = sig?.cron?.failing ?? [];
  const heartbeatMin = sig?.cron?.heartbeat_min ?? null;
  const aiBalance = sig?.ai_balance_usd ?? null;
  // Answer empty but neither degrade flag set → explain instead of going silent.
  const emptyAnswer = !!result && !result.answer && !result.ai_summary_disabled && !result.ai_fallback;

  const submit = (q: string) => {
    const text = q.trim();
    if (!text || mut.isPending) return;
    setQuestion(text);
    mut.mutate(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Bot className="h-5 w-5 text-gold" />}
        title="Trợ lý vận hành (AI)"
        description="Hỏi bằng tiếng Việt — trợ lý đọc số liệu hệ thống (KPI, tác vụ định kỳ, số dư AI) rồi tóm tắt. Chỉ đọc, không thao tác gì."
      />

      {/* Ask box */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                submit(question);
              }
            }}
            placeholder="Ví dụ: Hệ thống hôm nay có ổn không?"
            rows={3}
            className="resize-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  disabled={mut.isPending}
                  className="rounded-full border border-gold/25 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            <Button onClick={() => submit(question)} disabled={!question.trim() || mut.isPending}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {mut.isPending ? 'Đang hỏi…' : 'Hỏi'}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">Mẹo: ⌘/Ctrl + Enter để gửi nhanh.</p>
        </CardContent>
      </Card>

      {mut.isError && (
        <Card className="border-red-500/30">
          <CardContent className="flex items-start gap-2 p-4 text-sm text-red-600 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Không hỏi được: {(mut.error as Error).message}</span>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          {/* Degrade banners */}
          {result.ai_summary_disabled ? (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="flex items-start gap-2 p-3 text-xs text-amber-700 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Phần AI tổng-hợp đang tạm tắt (cổng AI chưa sẵn sàng). Số liệu thô vẫn hiển thị bên
                  dưới để anh tự nắm tình hình.
                </span>
              </CardContent>
            </Card>
          ) : result.ai_fallback ? (
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span>
                  Đang trả lời bằng <strong>model dự phòng miễn phí</strong> — nạp cổng AI để câu trả
                  lời sâu/chuẩn hơn.{' '}
                  <Link href="/infra/ai-gateway" className="text-gold underline-offset-2 hover:underline">
                    Xem cổng AI
                  </Link>
                </span>
              </CardContent>
            </Card>
          ) : null}

          {/* Answer */}
          {result.answer && (
            <Card className="border-gold/20">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Trả lời
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {result.answer}
                </p>
              </CardContent>
            </Card>
          )}

          {emptyAnswer && (
            <Card className="border-muted">
              <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Trợ lý chưa trả lời được lần này — anh xem số liệu bên dưới, hoặc thử hỏi lại.</span>
              </CardContent>
            </Card>
          )}

          {/* Raw signals — always shown so numbers are visible even with AI off */}
          <div>
            <h2 className="mb-2 text-sm font-medium text-foreground">Số liệu hệ thống</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((k) => (
                <KpiCard key={k.key} label={k.label} value={fmtKpiVal(k.value)} accent="gold" />
              ))}
              <KpiCard
                label="Số dư cổng AI"
                value={aiBalance === null ? '—' : `$${aiBalance.toFixed(2)}`}
                accent={aiBalance !== null && aiBalance < 3 ? 'red' : 'jade'}
              />
              <KpiCard
                label="Nhịp cron (mỗi giờ)"
                value={heartbeatMin === null ? 'chưa ghi nhận' : `${heartbeatMin} phút trước`}
                accent={heartbeatMin !== null && heartbeatMin > 90 ? 'warn' : 'jade'}
              />
              <KpiCard
                label="Tác vụ đang lỗi"
                value={failing.length}
                accent={failing.length > 0 ? 'red' : 'jade'}
                href="/architecture"
              />
            </div>

            {failing.length > 0 && (
              <Card className="mt-4 border-red-500/20">
                <CardContent className="p-4">
                  <div className="mb-2 text-xs font-medium text-red-600 dark:text-red-300">
                    Tác vụ định kỳ đang lỗi
                  </div>
                  <ul className="space-y-1 text-xs">
                    {failing.map((f, i) => (
                      <li key={`${f.job}-${i}`} className="flex items-center justify-between gap-2">
                        <span className="font-mono text-foreground/85">{f.job}</span>
                        <span className="truncate text-muted-foreground" title={f.note}>
                          {f.note ?? 'lỗi'}
                          {f.age_min !== null ? ` · ${f.age_min} phút trước` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <p className="mt-3 text-[11px] text-muted-foreground">
              Số liệu lúc {new Date(result.generated_at).toLocaleString('vi-VN')}. Trợ lý chỉ tóm tắt —
              mọi quyết định (đặc biệt về tiền) do anh quyết.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
