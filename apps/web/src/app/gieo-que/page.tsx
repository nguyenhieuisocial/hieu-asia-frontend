'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { parseTrigrams, getHaoDongMota, readingFocus } from '@/lib/hao-dong';
import { getHaoTu, getHaoTuExtra, HAO_TU_SOURCE } from '@/lib/que-hao-tu';
import { QUE_PAGES } from '@/lib/que-kinh-dich';

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

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Kinh Dịch là gì?',
    a: 'Kinh Dịch (Chu Dịch / I Ching) là một trong những bộ kinh cổ nhất của Á Đông, hình thành khoảng 3.000 năm trước. Hệ thống gồm 64 quẻ, mỗi quẻ là 6 hào âm (nét đứt) hoặc dương (nét liền) chồng lên nhau — mỗi quẻ mô tả một thế cục, một tình huống điển hình để người hỏi soi chiếu việc của mình.',
  },
  {
    q: 'Phép gieo 3 đồng xu hoạt động thế nào?',
    a: 'Gieo 3 đồng xu cùng lúc, sáu lần — mỗi lần ra một hào, xếp từ dưới lên. Tổ hợp sấp/ngửa của 3 đồng xu quyết định hào đó là âm hay dương, và là hào "tĩnh" hay hào "động" (đang chuyển). Sáu hào hợp thành một trong 64 quẻ.',
  },
  {
    q: 'Hào động và quẻ biến là gì?',
    a: 'Hào động là nét được xem như đang ở trạng thái chuyển hoá. Lật các hào động sang trạng thái ngược lại sẽ ra quẻ biến. Cách đọc truyền thống: quẻ chính nói về thế cục hiện tại, quẻ biến gợi ý hướng tình huống có thể chuyển tới.',
  },
  {
    q: 'Gieo online có khác gieo đồng xu thật không?',
    a: 'Về xác suất là tương đương: máy mô phỏng đúng phép 3 đồng xu — mỗi hào có 1/8 khả năng là âm động, 3/8 dương tĩnh, 3/8 âm tĩnh, 1/8 dương động, giống hệt khi bạn gieo xu thật. Còn sự "linh nghiệm" theo nghĩa huyền bí thì hieu.asia không hứa — giá trị của quẻ nằm ở câu hỏi rõ ràng và sự chiêm nghiệm khi đọc, không nằm ở đồng xu.',
  },
  {
    q: 'Nên hỏi thế nào để quẻ có ích?',
    a: 'Hỏi một việc cụ thể mỗi lần gieo, và ưu tiên câu hỏi mở — ví dụ "điều gì cần lưu ý nếu tôi đổi việc lúc này?" thay vì bắt quẻ trả lời có/không. Đọc xong, hãy đối chiếu lời quẻ với hoàn cảnh thật của bạn: chỗ nào "chạm" thì đó là thứ đáng suy nghĩ tiếp.',
  },
  {
    q: 'Gieo quẻ có phải bói toán không?',
    a: 'hieu.asia trình bày quẻ Dịch như công cụ gợi mở suy ngẫm — một tấm gương giúp bạn nhìn tình huống từ góc khác — chứ không phải lời tiên đoán chắc chắn về tương lai. Quẻ không quyết định thay bạn; nó giúp bạn nghĩ kỹ hơn trước khi tự quyết.',
  },
];

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <ToolPageShell
        eyebrow="Kinh Dịch cổ truyền"
        relatedSlug="/gieo-que"
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
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href="/gieo-que/y-nghia"
          className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
        >
          <span className="text-foreground/85">📖 <b className="text-foreground">Ý nghĩa 64 quẻ</b> — tra cứu tượng quẻ, thế cục &amp; lời khuyên từng quẻ</span>
          <span className="shrink-0 text-gold">Mở →</span>
        </Link>
      </div>
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

                {/* Trọng tâm nên đọc — luật Chu Hy theo số hào động */}
                {(() => {
                  // Thuần Càn = quẻ số 1, Thuần Khôn = quẻ số 2 (trình tự King Wen).
                  const isQianKun =
                    result.hexagramPrimary.id === 1 || result.hexagramPrimary.id === 2;
                  const focus = readingFocus(result.movingLines, isQianKun);
                  return (
                    <Card className="border-gold/30 bg-gold/5">
                      <CardHeader>
                        <CardTitle className="text-base text-gold-700">
                          🎯 Trọng tâm nên đọc — <span className="font-normal">{focus.rule}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5">
                        <p className="text-sm leading-relaxed text-foreground/85">{focus.note}</p>
                        {focus.chuDao !== null && (
                          <p className="text-sm text-foreground/85">
                            <span className="font-semibold text-gold-700">Hào chủ đạo:</span>{' '}
                            {getHaoDongMota(focus.chuDao)?.ten ?? `Hào ${focus.chuDao}`}
                          </p>
                        )}
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Phép xét theo số hào động của Chu Hy 朱熹{' '}
                          <span className="italic">《易學啟蒙》</span> — cách đọc cổ điển giúp biết{' '}
                          <em>nên tập trung vào lời nào</em> giữa quẻ chính, quẻ biến và các hào.
                          Gợi ý chiêm nghiệm, không phải lời phán quyết.
                        </p>
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Thượng quái / Hạ quái */}
                {(() => {
                  const trigrams = parseTrigrams(result.hexagramPrimary.binary);
                  if (!trigrams) return null;
                  const { upper, lower } = trigrams;
                  return (
                    <Card className="border-border bg-card/50">
                      <CardHeader>
                        <CardTitle className="text-base">Cấu trúc quẻ — Bát Quái</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg border border-border bg-card/40 p-3 text-center">
                            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Thượng quái (ngoài)</div>
                            <div className="text-2xl" aria-hidden>{upper.icon}</div>
                            <div className="font-semibold text-foreground mt-1">{upper.ten} · {upper.tuong}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Hành {upper.hanh}</div>
                          </div>
                          <div className="rounded-lg border border-border bg-card/40 p-3 text-center">
                            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Hạ quái (trong)</div>
                            <div className="text-2xl" aria-hidden>{lower.icon}</div>
                            <div className="font-semibold text-foreground mt-1">{lower.ten} · {lower.tuong}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Hành {lower.hanh}</div>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          Mỗi quẻ gồm hai tầng: Hạ quái (3 hào dưới) phản chiếu tình thế bên trong hoặc khởi đầu,
                          Thượng quái (3 hào trên) phản chiếu tình thế bên ngoài hoặc hướng vận động.
                          Gợi ý chiêm nghiệm, không phải lời tiên đoán.
                        </p>
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Hào động — ý nghĩa vị trí */}
                {result.movingLines.length > 0 && (
                  <Card className="border-border bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-base text-gold-700">Hào động — vị trí chuyển hoá</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground/75">
                        Những hào đang ở trạng thái chuyển — gợi ý nơi tình huống có khả năng thay đổi.
                      </p>
                      {result.movingLines.map((haoSo) => {
                        const info = getHaoDongMota(haoSo);
                        const hao = getHaoTu(result.hexagramPrimary.id, haoSo);
                        if (!info && !hao) return null;
                        const heading = [hao?.label, info?.ten].filter(Boolean).join(' · ');
                        return (
                          <div key={haoSo} className="rounded-md border border-gold/20 bg-gold/5 px-3 py-2.5">
                            <div className="text-xs font-semibold text-gold-700 mb-1">{heading || `Hào ${haoSo}`}</div>
                            {hao && (
                              <div className="mb-2 border-l-2 border-gold/30 pl-3">
                                <p lang="zh-Hant" className="font-heading text-base leading-relaxed text-foreground">{hao.han}</p>
                                <p className="text-sm italic leading-relaxed text-foreground/80">{hao.hanViet}</p>
                                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{hao.nghia}</p>
                              </div>
                            )}
                            {info && <p className="text-sm leading-relaxed text-foreground/85">{info.mo_ta}</p>}
                          </div>
                        );
                      })}
                      {(() => {
                        // Càn/Khôn: cả 6 hào động → đọc 用九/用六 (lời chốt riêng).
                        const ex =
                          result.movingLines.length === 6
                            ? getHaoTuExtra(result.hexagramPrimary.id)
                            : undefined;
                        return ex ? (
                          <div className="rounded-md border border-gold/30 bg-gold/10 px-3 py-2.5">
                            <div className="text-xs font-semibold text-gold-700 mb-1">{ex.label} · cả sáu hào đều động</div>
                            <p lang="zh-Hant" className="font-heading text-base leading-relaxed text-foreground">{ex.han}</p>
                            <p className="text-sm italic leading-relaxed text-foreground/80">{ex.hanViet}</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{ex.nghia}</p>
                          </div>
                        ) : null;
                      })()}
                      <p className="border-t border-border/60 pt-2.5 text-xs leading-relaxed text-muted-foreground">
                        {HAO_TU_SOURCE}
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

                {/* Link xem chi tiết quẻ */}
                {(() => {
                  const queSlug = QUE_PAGES.find((q) => q.id === result.hexagramPrimary.id)?.slug;
                  if (!queSlug) return null;
                  return (
                    <Link
                      href={`/gieo-que/y-nghia/${queSlug}`}
                      className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-gold/10"
                    >
                      <span>
                        Đọc sâu quẻ <span className="text-gold-700">{result.hexagramPrimary.nameVi}</span>
                        <span className="ml-1 text-muted-foreground font-normal">— tượng quẻ, góc tình cảm, công việc, câu tự soi</span>
                      </span>
                      <span aria-hidden className="ml-3 flex-shrink-0 text-gold-700">→</span>
                    </Link>
                  );
                })()}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <ShareResultButton
                    path="/gieo-que"
                    title="Gieo quẻ Kinh Dịch — hieu.asia"
                    text={`Tôi vừa gieo được quẻ ${result.hexagramPrimary.nameVi}. Bạn thử gieo một quẻ xem?`}
                    trackId="gieo-que"
                  />
                  <DownloadToolPdfButton
                    payload={() => {
                      if (!result) return null;
                      const trigrams = parseTrigrams(result.hexagramPrimary.binary);
                      const sections: ToolPdfPayload['sections'] = [
                        {
                          heading: 'Quẻ chính',
                          rows: [
                            { label: 'Tên quẻ', value: `${result.hexagramPrimary.nameVi} (${result.hexagramPrimary.name})` },
                            { label: 'Số quẻ', value: `${result.hexagramPrimary.id}` },
                          ],
                        },
                      ];
                      if (asked) {
                        sections.unshift({ heading: 'Điều bạn hỏi', text: asked });
                      }
                      if (result.interpretation.primary) {
                        sections.push({ heading: 'Lời quẻ chính', text: result.interpretation.primary });
                      }
                      if (trigrams) {
                        sections.push({
                          heading: 'Cấu trúc quẻ — Bát Quái',
                          rows: [
                            { label: 'Thượng quái (ngoài)', value: `${trigrams.upper.ten} · ${trigrams.upper.tuong} · Hành ${trigrams.upper.hanh}` },
                            { label: 'Hạ quái (trong)', value: `${trigrams.lower.ten} · ${trigrams.lower.tuong} · Hành ${trigrams.lower.hanh}` },
                          ],
                        });
                      }
                      if (result.movingLines.length > 0) {
                        sections.push({
                          heading: 'Hào động — vị trí chuyển hoá',
                          rows: result.movingLines
                            .map((haoSo) => getHaoDongMota(haoSo))
                            .filter((info): info is NonNullable<typeof info> => info !== null)
                            .map((info) => ({ label: info.ten, value: info.mo_ta })),
                        });
                      }
                      if (result.hexagramChanging) {
                        sections.push({
                          heading: 'Quẻ biến',
                          rows: [
                            { label: 'Tên quẻ', value: `${result.hexagramChanging.nameVi} (${result.hexagramChanging.name})` },
                            { label: 'Số quẻ', value: `${result.hexagramChanging.id}` },
                          ],
                        });
                        if (result.interpretation.changing) {
                          sections.push({ heading: 'Lời quẻ biến', text: result.interpretation.changing });
                        }
                      }
                      return {
                        title: `Quẻ ${result.hexagramPrimary.nameVi} — Gieo quẻ Kinh Dịch hieu.asia`,
                        subtitle: 'Quẻ Dịch là công cụ gợi mở suy ngẫm, không phải lời tiên đoán chắc chắn.',
                        sections,
                      };
                    }}
                  />
                </div>

                <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                  Quẻ Dịch là công cụ gợi mở suy ngẫm để bạn nhìn việc rõ hơn rồi tự quyết — không
                  phải lời tiên đoán chắc chắn về tương lai.
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          aria-labelledby="gq-about-heading"
          className="mt-12 border-t border-border pt-10"
        >
          <h2
            id="gq-about-heading"
            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Kinh Dịch &amp; phép gieo hoạt động thế nào?
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p>
              Kinh Dịch là bộ kinh cổ ~3.000 năm của Á Đông, gồm{' '}
              <strong className="text-foreground">64 quẻ</strong> — mỗi quẻ là 6
              hào âm (nét đứt) hoặc dương (nét liền), mô tả một thế cục điển
              hình. Trang này dùng{' '}
              <strong className="text-foreground">phép gieo 3 đồng xu</strong>:
              gieo sáu lần, mỗi lần ra một hào từ dưới lên; hào &ldquo;động&rdquo;
              (đang chuyển) sẽ lật ra <strong className="text-foreground">quẻ
              biến</strong> — quẻ chính nói thế cục hiện tại, quẻ biến gợi hướng
              chuyển.
            </p>
            <p>
              Minh bạch để bạn rõ: máy mô phỏng{' '}
              <strong className="text-foreground">đúng xác suất</strong> của phép
              3 đồng xu thật (mỗi hào: 1/8 âm động · 3/8 dương tĩnh · 3/8 âm tĩnh
              · 1/8 dương động), và lời giải được soạn theo nghĩa truyền thống
              của từng quẻ. Quẻ Dịch ở đây là công cụ gợi mở suy ngẫm — đúng tinh
              thần &ldquo;không bói mù&rdquo; — không phải lời tiên đoán chắc
              chắn; quyết định cuối cùng vẫn là của bạn.
            </p>
          </div>
        </section>

        <section aria-labelledby="gq-faq-heading" className="mt-10">
          <h2
            id="gq-faq-heading"
            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Câu hỏi thường gặp
          </h2>
          <dl className="mt-4 space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border border-border bg-card/40 px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </dl>
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
