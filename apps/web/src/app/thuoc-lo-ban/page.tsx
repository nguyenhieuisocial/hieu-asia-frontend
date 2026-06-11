'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

type LoBanType = 'lo_ban_42_9' | 'lo_ban_38_8' | 'thuoc_ban_52_2' | 'dinh_lan';

interface LoBanResult {
  cm: number;
  type_used: LoBanType;
  type_label: string;
  block: string;
  sub: string;
  fortune: 'Tốt' | 'Xấu';
  meaning: string;
  position_in_cycle_cm: number;
  cycle_length_cm: number;
  next_good?: { cm: number; block: string; sub: string };
  prev_good?: { cm: number; block: string; sub: string };
}

const TYPE_OPTIONS: { value: LoBanType; label: string; hint: string }[] = [
  { value: 'lo_ban_42_9', label: 'Lỗ Ban 42.9 cm', hint: 'Thông thủy — cửa, cổng, bàn thờ' },
  { value: 'lo_ban_38_8', label: 'Lỗ Ban 38.8 cm', hint: 'Dương trạch — đồ vật, giường, tủ' },
  { value: 'thuoc_ban_52_2', label: 'Thước Ban 52.2 cm', hint: 'Âm trạch — mộ phần' },
  { value: 'dinh_lan', label: 'Thước Đinh Lan 38.4 cm', hint: 'Quan tài, mộ phần' },
];

const FAQS = [
  {
    q: 'Thước Lỗ Ban là gì?',
    a: 'Là cây thước phong thủy của nghề mộc cổ truyền, chia chiều dài thành các cung Tốt – Xấu xen kẽ. Khi đo một vật (cửa, bàn thờ, giường…), người ta cố chọn kích thước rơi vào cung tốt. Đây là quy ước truyền thống của thợ, mang tính tham khảo — không phải định luật.',
  },
  {
    q: 'Vì sao có nhiều loại thước Lỗ Ban?',
    a: 'Mỗi loại dùng cho một mục đích và có chu kỳ khác nhau: thước 42.9 cm (thông thủy) cho khoảng trống như cửa, cổng, bàn thờ; thước 38.8 cm (dương trạch) cho đồ vật như giường, tủ, bàn; thước 52.2 cm và Đinh Lan 38.4 cm dùng cho âm trạch (mộ phần, quan tài). Chọn đúng loại thước theo vật cần đo mới ra kết quả phù hợp.',
  },
  {
    q: 'Cách dùng công cụ này?',
    a: 'Nhập kích thước (cm) và chọn loại thước. Hệ thống quy về chu kỳ của thước đó, cho biết kích thước rơi vào cung Tốt hay Xấu, ý nghĩa ô con, và nếu xấu thì gợi ý kích thước tốt gần nhất (nhỏ hơn / lớn hơn) để bạn điều chỉnh.',
  },
  {
    q: 'Kích thước rơi vào cung xấu thì có sao không?',
    a: 'Đây chỉ là một yếu tố tham khảo theo phong tục, không phải điều bắt buộc. Nếu lịch và điều kiện cho phép, bạn có thể chỉnh sang kích thước tốt gần nhất cho an tâm; nếu không, công năng và sự chắc chắn của vật dụng vẫn là điều quan trọng hơn cả.',
  },
  {
    q: 'Đo theo lọt lòng hay phủ bì?',
    a: 'Với cửa, cổng (thước thông thủy 42.9 cm) thường đo khoảng thông thủy — tức lọt lòng, phần trống ánh sáng đi qua. Với đồ vật (thước dương trạch 38.8 cm) đo kích thước phủ bì của vật. Đo đúng quy ước của từng loại thước thì kết quả mới chuẩn.',
  },
];

export default function ThuocLoBanPage() {
  const [valueCm, setValueCm] = React.useState('81');
  const [type, setType] = React.useState<LoBanType>('lo_ban_42_9');
  const [result, setResult] = React.useState<LoBanResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const v = Number(valueCm);
    if (!Number.isFinite(v) || v <= 0) {
      setError('Vui lòng nhập kích thước hợp lệ (cm).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/thuoc-lo-ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value_cm: v, type }),
      });
      const parsed = await safeJson<{ ok: boolean; result?: LoBanResult; error?: string }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const json = parsed.data;
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tra được kích thước');
      setResult(json.result);
      track('tool_used', { tool: 'thuoc-lo-ban', result: 'ok' });
    } catch (e) {
      setError((e as Error).message);
      track('tool_used', { tool: 'thuoc-lo-ban', result: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedLabel = TYPE_OPTIONS.find((t) => t.value === type)?.label ?? '';
  const isGood = result?.fortune === 'Tốt';

  return (
    <>
    <JsonLd data={faqPage(FAQS)} />
    <ToolPageShell
      eyebrow="Phong thủy · Lỗ Ban"
        relatedSlug="/thuoc-lo-ban"
      icon={<span aria-hidden="true">📏</span>}
      title={
        <>
          Thước <GoldAccent>Lỗ Ban</GoldAccent>
        </>
      }
      description="Tra cứu kích thước phong thủy theo Thước Lỗ Ban — cung Tốt/Xấu, ô con, ý nghĩa và gợi ý kích thước tốt gần nhất."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thước Lỗ Ban' },
      ]}
    >
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Nhập kích thước</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="value_cm" className="text-foreground/85">
                    Kích thước (cm)
                  </Label>
                  <Input
                    id="value_cm"
                    type="number"
                    min={0}
                    step="0.1"
                    value={valueCm}
                    onChange={(e) => setValueCm(e.target.value)}
                    required
                    className="bg-card/60 font-mono text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  {/* Wave 54 BUG-032: bind Label → SelectTrigger via htmlFor/id
                      so screen-readers + form-autofill announce the field name. */}
                  <Label htmlFor="lo-ban-type" className="text-foreground/85">Loại thước</Label>
                  <Select value={type} onValueChange={(v) => setType(v as LoBanType)}>
                    <SelectTrigger id="lo-ban-type" aria-label="Loại thước" className="bg-card/60">
                      <SelectValue>{selectedLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{t.label}</span>
                            <span className="text-xs text-foreground/60">{t.hint}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {loading ? 'Đang tra...' : 'Tra Thước Lỗ Ban →'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {loading && <LoBanLoadingSkeleton />}

          {!loading && !result && (
            <Card className="border-dashed border-border bg-card/30">
              <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div aria-hidden className="text-5xl">📏</div>
                <h2 className="mt-4 font-heading text-lg text-foreground">Chưa có kết quả</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Nhập kích thước (cm) và chọn loại thước. Hệ thống sẽ tra cung Tốt / Xấu, ý nghĩa
                  ô con và gợi ý kích thước tốt gần nhất nếu kích thước hiện tại rơi vào cung xấu.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <Card
                className={`relative overflow-hidden border ${
                  isGood
                    ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent'
                    : 'border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-transparent'
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl"
                />
                <CardContent className="relative p-6 text-center sm:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {result.cm} cm · {result.type_label}
                  </div>
                  <div className="my-3 bg-gold-gradient bg-clip-text font-heading text-3xl font-bold text-transparent sm:text-4xl">
                    {result.block} · {result.sub}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
                      isGood
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {isGood ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {result.fortune}
                  </span>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/85">
                    {result.meaning}
                  </p>
                  <p className="mt-3 font-mono text-[10px] tracking-wide text-muted-foreground">
                    Vị trí trong chu kỳ: {result.position_in_cycle_cm.toFixed(1)} /{' '}
                    {result.cycle_length_cm} cm
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3">
                <ShareResultButton
                  path="/thuoc-lo-ban"
                  title="Thước Lỗ Ban"
                  text="Mình vừa tra thước Lỗ Ban trên hieu.asia — tiện lắm!"
                  trackId="thuoc-lo-ban"
                />
              </div>

              {(result.next_good || result.prev_good) && (
                <Card className="border-border bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-base text-gold-700">
                      Gợi ý kích thước tốt gần nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {result.prev_good && (
                      <SuggestionCell direction="Nhỏ hơn" suggestion={result.prev_good} />
                    )}
                    {result.next_good && (
                      <SuggestionCell direction="Lớn hơn" suggestion={result.next_good} />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Giáo dục: Thước Lỗ Ban là gì + 4 loại thước — lớp "nói có sách" cho SEO */}
      <section className="mt-12" aria-label="Tìm hiểu Thước Lỗ Ban">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Thước Lỗ Ban — hiểu để dùng đúng
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Thước Lỗ Ban là cây thước phong thủy của nghề mộc cổ truyền, chia chiều dài thành các cung
          <strong className="text-foreground"> Tốt – Xấu</strong> xen kẽ. Khi đo một vật, người ta cố
          chọn kích thước rơi vào cung tốt. Mỗi loại thước dùng cho một mục đích riêng — chọn đúng
          loại theo vật cần đo mới ra kết quả phù hợp:
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {TYPE_OPTIONS.map((t) => (
            <div key={t.value} className="rounded-xl border border-border bg-card/40 p-4">
              <div className="font-heading text-base font-semibold text-foreground">{t.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t.hint}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Lưu ý cách đo: cửa, cổng (thước thông thủy) đo khoảng lọt lòng; đồ vật (thước dương trạch)
          đo phủ bì. Đây là quy ước truyền thống mang tính tham khảo — công năng và độ chắc chắn của
          vật dụng vẫn quan trọng hơn cả.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12" aria-label="Câu hỏi thường gặp về Thước Lỗ Ban">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Câu hỏi thường gặp
        </h2>
        <dl className="mt-5 space-y-5">
          {FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-foreground">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ToolPageShell>
    <StickyMobileCta trackId="thuoc-lo-ban" />
    </>
  );
}

function SuggestionCell({
  direction,
  suggestion,
}: {
  direction: string;
  suggestion: { cm: number; block: string; sub: string };
}) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition-colors hover:bg-emerald-500/10">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300/80">
        {direction}
      </div>
      <div className="mt-1.5 font-heading text-xl font-semibold text-foreground">{suggestion.cm} cm</div>
      <div className="mt-1 text-xs text-muted-foreground">
        {suggestion.block} · {suggestion.sub}
      </div>
    </div>
  );
}

function LoBanLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto mt-3 h-10 w-48" />
          <Skeleton className="mx-auto mt-3 h-5 w-20 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-4 w-3/4" />
        </CardContent>
      </Card>
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}
