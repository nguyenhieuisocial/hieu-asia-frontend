'use client';

import * as React from 'react';
import { Button, Card, CardContent, Input, Skeleton } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface Hexagram {
  id: number;
  name: string;
  nameVi: string;
  binary: string;
}
interface IChingResult {
  hexagramPrimary: Hexagram;
  hexagramChanging?: Hexagram;
  movingLines: number[];
  interpretation: { primary: string; changing?: string };
}

/** Vẽ 6 hào từ binary (ký tự 0 = hào 6 đỉnh → ký tự 5 = hào 1 đáy). '1' = dương (liền), '0' = âm (đứt). */
function HexGlyph({ binary, moving }: { binary: string; moving: number[] }) {
  return (
    <div aria-hidden="true" className="mx-auto flex w-20 flex-col gap-1.5">
      {binary.split('').map((b, i) => {
        const hao = 6 - i; // ký tự đầu là hào 6
        const isMoving = moving.includes(hao);
        const color = isMoving ? 'bg-gold' : 'bg-foreground/70';
        return (
          <div key={i} className="flex h-2.5 items-stretch justify-center gap-1.5">
            {b === '1' ? (
              <span className={`w-full rounded-sm ${color}`} />
            ) : (
              <>
                <span className={`w-2/5 rounded-sm ${color}`} />
                <span className={`w-2/5 rounded-sm ${color}`} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HexCard({ hex, moving, title, text }: { hex: Hexagram; moving: number[]; title: string; text: string }) {
  return (
    <Card className="border-gold/20 bg-card/50">
      <CardContent className="p-6 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{title}</div>
        <div className="mt-4"><HexGlyph binary={hex.binary} moving={moving} /></div>
        <h2 className="mt-4 bg-gold-gradient bg-clip-text font-heading text-2xl font-bold text-transparent">{hex.nameVi}</h2>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">Quẻ {hex.id} · {hex.name}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{text}</p>
      </CardContent>
    </Card>
  );
}

export default function GieoQuePage() {
  const [question, setQuestion] = React.useState('');
  const [result, setResult] = React.useState<IChingResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onCast = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/iching`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // gieo ngẫu nhiên (giữ câu hỏi trong tâm); không seed
      });
      const parsed = await safeJson<{ ok: boolean; result?: IChingResult; error?: string }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const json = parsed.data;
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không gieo được quẻ');
      setResult(json.result);
      track('tool_used', { tool: 'gieo-que', result: 'ok' });
    } catch (e) {
      setError((e as Error).message);
      track('tool_used', { tool: 'gieo-que', result: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToolPageShell
        eyebrow="KINH DỊCH · PHẢN TƯ"
        icon={<span aria-hidden="true">☯️</span>}
        title={<>Gieo Quẻ <GoldAccent>Kinh Dịch</GoldAccent></>}
        description="Giữ điều bạn đang phân vân trong tâm, gieo quẻ (3 đồng × 6 lần) — quẻ chính, hào động và quẻ biến là một lăng kính để soi quyết định. Không bói toán, không tiên đoán."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Gieo Quẻ Kinh Dịch' }]}
      >
        <div className="mx-auto max-w-2xl">
          <Card className="border-gold/20 bg-card/60">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label htmlFor="iching-q" className="text-sm text-foreground/85">Điều bạn đang phân vân (không bắt buộc)</label>
                <Input id="iching-q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="vd: Có nên chuyển hướng công việc lúc này không?" className="bg-card/60" />
              </div>
              {error && <p role="alert" className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
              <Button onClick={onCast} disabled={loading} className="w-full">
                {loading ? 'Đang gieo...' : result ? '↻ Gieo lại' : 'Gieo quẻ →'}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-64 rounded-xl" />
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                {question.trim() && <p className="text-center text-sm italic text-muted-foreground">“{question.trim()}”</p>}
                <HexCard hex={result.hexagramPrimary} moving={result.movingLines} title="Quẻ chính" text={result.interpretation.primary} />
                {result.movingLines.length > 0 && (
                  <p className="text-center text-xs text-muted-foreground">
                    Hào động: {result.movingLines.sort((a, b) => a - b).join(', ')} — đây là nơi tình huống đang chuyển.
                  </p>
                )}
                {result.hexagramChanging && result.interpretation.changing && (
                  <HexCard hex={result.hexagramChanging} moving={[]} title="Quẻ biến · hướng chuyển" text={result.interpretation.changing} />
                )}
                <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  Kinh Dịch ở đây là <b className="text-foreground/80">gợi ý để bạn tự suy ngẫm</b> về tình huống và cách ứng xử — không phải tiên đoán số phận. Quyết định cuối cùng luôn là của bạn.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolPageShell>
      <StickyMobileCta trackId="gieo-que" />
    </>
  );
}
