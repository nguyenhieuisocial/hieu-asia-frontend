'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Skeleton,
} from '@hieu-asia/ui';
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

export default function GieoQuePage() {
  const [question, setQuestion] = React.useState('');
  const [asked, setAsked] = React.useState('');
  const [result, setResult] = React.useState<IChingResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onCast = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setAsked(question.trim());
    try {
      // Gieo ngẫu nhiên (3 đồng xu × 6 lần) — đúng tinh thần bốc quẻ.
      const res = await fetch(`${API_BASE}/tools/iching`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
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
        eyebrow="Kinh Dịch cổ truyền"
        icon={<span aria-hidden="true">☯</span>}
        title={
          <>
            Gieo Quẻ <GoldAccent>Kinh Dịch</GoldAccent>
          </>
        }
        description="Tâm niệm điều muốn hỏi rồi gieo quẻ theo phép 3 đồng xu — sáu hào tạo thành một trong 64 quẻ Kinh Dịch, kèm quẻ biến và lời gợi mở."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Gieo Quẻ Kinh Dịch' },
        ]}
      >
        <section className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Tâm niệm câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={onCast}>
                  <div className="space-y-1.5">
                    <Label htmlFor="question" className="text-foreground/85">
                      Điều bạn muốn hỏi <span className="text-muted-foreground">(không bắt buộc)</span>
                    </Label>
                    <textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={3}
                      maxLength={200}
                      placeholder="VD: Tháng này có nên đổi công việc không?"
                      className="flex w-full rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                    />
                    <p className="text-xs text-muted-foreground">
                      Giữ một việc cụ thể trong tâm trí khi gieo. Câu hỏi chỉ để bạn ghi nhớ ngữ
                      cảnh — không ảnh hưởng kết quả gieo.
                    </p>
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                    >
                      {error}
                    </p>
                  )}
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Đang gieo...' : result ? 'Gieo lại quẻ khác →' : 'Gieo quẻ →'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {loading && <GieoQueLoadingSkeleton />}

            {!loading && !result && (
              <Card className="border-dashed border-border bg-card/30">
                <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <div aria-hidden className="text-5xl">☯</div>
                  <h2 className="mt-4 font-heading text-lg text-foreground">Chưa gieo quẻ</h2>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Tĩnh tâm, nghĩ về điều muốn hỏi rồi bấm “Gieo quẻ”. Hệ thống mô phỏng gieo 3
                    đồng xu sáu lần để lập quẻ.
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && result && (
              <div className="space-y-4">
                {asked && (
                  <p className="rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-foreground/80">
                    <span className="text-muted-foreground">Điều bạn hỏi: </span>
                    {asked}
                  </p>
                )}

                <Card className="relative overflow-hidden border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                  />
                  <CardContent className="relative grid gap-6 p-6 sm:p-8 sm:grid-cols-[auto_1fr] sm:items-center">
                    <HexagramGlyph binary={result.hexagramPrimary.binary} movingLines={result.movingLines} />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                        Quẻ chính · số {result.hexagramPrimary.id}
                      </div>
                      <div className="my-1 bg-gold-gradient bg-clip-text font-heading text-3xl font-bold text-transparent">
                        {result.hexagramPrimary.nameVi}
                      </div>
                      <div className="text-sm text-foreground/70">{result.hexagramPrimary.name}</div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                        {result.interpretation.primary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {result.movingLines.length > 0 && (
                  <Card className="border-border bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-base text-gold-700">Hào động</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        Hào động:{' '}
                        <span className="font-semibold text-foreground">
                          {result.movingLines.map((n) => `hào ${n}`).join(', ')}
                        </span>
                        . Đây là những nét đang chuyển — gợi ý nơi tình huống có khả năng thay đổi,
                        dẫn tới quẻ biến bên dưới.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {result.hexagramChanging && (
                  <Card className="border-border bg-card/50">
                    <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
                      <HexagramGlyph binary={result.hexagramChanging.binary} movingLines={[]} />
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          Quẻ biến · số {result.hexagramChanging.id}
                        </div>
                        <div className="my-1 font-heading text-2xl font-semibold text-foreground">
                          {result.hexagramChanging.nameVi}
                        </div>
                        <div className="text-sm text-foreground/70">{result.hexagramChanging.name}</div>
                        {result.interpretation.changing && (
                          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                            {result.interpretation.changing}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                  Quẻ Dịch là công cụ gợi mở suy ngẫm để bạn nhìn việc rõ hơn rồi tự quyết — không
                  phải lời tiên đoán chắc chắn về tương lai.
                </p>
              </div>
            )}
          </div>
        </section>
      </ToolPageShell>
      <StickyMobileCta trackId="gieo-que" />
    </>
  );
}

/** Vẽ 6 hào của quẻ. binary[0] = hào 6 (đỉnh) → binary[5] = hào 1 (đáy). */
function HexagramGlyph({ binary, movingLines }: { binary: string; movingLines: number[] }) {
  const moving = new Set(movingLines);
  return (
    <div className="mx-auto flex w-28 flex-col gap-1.5" aria-hidden>
      {binary.split('').map((bit, i) => {
        const lineNo = 6 - i; // index 0 = hào 6 (đỉnh)
        const isYang = bit === '1';
        const isMoving = moving.has(lineNo);
        return (
          <div key={i} className="flex h-3 items-center justify-center gap-2">
            {isYang ? (
              <span
                className={`h-full w-full rounded-sm ${isMoving ? 'bg-gold' : 'bg-foreground/80'}`}
              />
            ) : (
              <>
                <span className={`h-full w-[44%] rounded-sm ${isMoving ? 'bg-gold' : 'bg-foreground/80'}`} />
                <span className={`h-full w-[44%] rounded-sm ${isMoving ? 'bg-gold' : 'bg-foreground/80'}`} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GieoQueLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50">
        <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="mx-auto flex w-28 flex-col gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-3 w-full rounded-sm" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
