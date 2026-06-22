'use client';

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { getPersonalitySummary } from '@/lib/personality-store';

const STATEMENTS: string[] = [
  'Bạn có nhu cầu được người khác yêu mến và ngưỡng mộ.',
  'Bạn có xu hướng tự phê bình chính mình.',
  'Bạn còn nhiều khả năng tiềm ẩn chưa khai thác hết.',
  'Tuy tính cách có vài điểm yếu, nhìn chung bạn biết cách bù đắp chúng.',
  'Bề ngoài bạn kỷ luật và tự chủ, nhưng bên trong đôi khi lo lắng, bất an.',
  'Có lúc bạn nghiêm túc nghi ngờ liệu mình đã quyết định hay làm điều đúng chưa.',
  'Bạn thích đổi mới, đa dạng, và thấy bứt rứt khi bị gò bó bởi luật lệ hay khuôn khổ.',
  'Bạn tự hào suy nghĩ độc lập, không vội tin lời người khác nếu chưa đủ bằng chứng.',
  'Đôi khi bạn cởi mở, hòa đồng; lúc khác lại hướng nội, dè dặt và kín đáo.',
  'Một vài khát vọng của bạn đôi khi khá phi thực tế.',
];

export default function TuKiemPage() {
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = React.useState(false);
  const [personalSummary, setPersonalSummary] = React.useState<string | null>(null);
  const [selfRate, setSelfRate] = React.useState<'yes' | 'partial' | 'no' | null>(null);

  React.useEffect(() => {
    const s = getPersonalitySummary();
    setPersonalSummary(s ? s : null);
  }, []);

  const score = Object.values(checked).filter(Boolean).length;

  const toggle = (i: number, val: boolean) => {
    setChecked((prev) => ({ ...prev, [i]: val }));
  };

  const handleReveal = () => {
    setRevealed(true);
    track('tool_used', { tool: 'tu-kiem', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setChecked({});
    setRevealed(false);
    setSelfRate(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ToolPageShell
        eyebrow="Không bói mù · Tự kiểm"
        icon={<span aria-hidden>🪞</span>}
        title={
          <>
            Đừng tin <GoldAccent>mù</GoldAccent>
          </>
        }
        description="Trước khi tin bất kỳ lời giải nào — kể cả của chúng tôi — hãy thử bài 1 phút này. Đọc 10 mô tả dưới đây và chấm xem câu nào ĐÚNG với con người bạn."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tự kiểm' },
        ]}
        relatedSlug="/tu-kiem"
      >
        <section className="mt-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {/* Phase 1 — statement list */}
            <div className="space-y-3">
              {STATEMENTS.map((stmt, i) => {
                const isTrue = checked[i] === true;
                const isFalse = checked[i] === false;
                return (
                  <Card
                    key={i}
                    className={`border transition-colors duration-150 ${
                      isTrue
                        ? 'border-gold/50 bg-gold/[0.07]'
                        : isFalse
                        ? 'border-border/40 bg-card/30'
                        : 'border-border bg-card/50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <p className="mb-3 text-sm leading-relaxed text-foreground/90">
                        <span className="mr-2 font-mono text-[11px] text-muted-foreground">{i + 1}.</span>
                        {stmt}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isTrue ? 'default' : 'outline'}
                          onClick={() => toggle(i, true)}
                          className={
                            isTrue
                              ? 'border-gold bg-gold text-background hover:bg-gold/90'
                              : 'border-border/60 text-foreground/70 hover:border-gold/50 hover:text-gold'
                          }
                        >
                          Đúng với tôi
                        </Button>
                        <Button
                          size="sm"
                          variant={isFalse ? 'default' : 'outline'}
                          onClick={() => toggle(i, false)}
                          className={
                            isFalse
                              ? 'bg-muted text-foreground hover:bg-muted/80'
                              : 'border-border/60 text-foreground/70 hover:border-border hover:text-foreground'
                          }
                        >
                          Không hẳn
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Reveal button */}
            {!revealed && (
              <div className="pt-2">
                <Button
                  size="lg"
                  className="w-full bg-gold text-background hover:bg-gold/90 sm:w-auto"
                  onClick={handleReveal}
                >
                  Xem kết quả →
                </Button>
              </div>
            )}

            {/* Phase 2 — result card */}
            {revealed && (
              <>
                <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                  <CardContent className="p-6">
                    <p className="font-heading text-xl font-semibold text-foreground">
                      Bạn thấy{' '}
                      <span className="bg-gold-gradient bg-clip-text text-transparent">{score}/10</span>{' '}
                      câu đúng với mình.
                    </p>
                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
                      <p>
                        Sự thật:{' '}
                        <strong className="text-foreground">
                          cả 10 câu trên đều là mô tả mơ hồ — đúng với gần như tất cả mọi người.
                        </strong>{' '}
                        Năm 1948, nhà tâm lý Bertram Forer đưa đúng loạt câu này cho sinh viên như "bản phân
                        tích tính cách riêng của em" — trung bình họ chấm 4.3/5 là "chính xác". Hiện tượng
                        đó tên là{' '}
                        <strong className="text-foreground">hiệu ứng Forer (hay Barnum)</strong>.
                      </p>
                      <p>
                        Cảm giác "
                        <strong className="text-foreground">đúng ghê, sao biết hay vậy</strong>" khi xem bói
                        chính là cái bẫy này. Thầy bói và livestream tâm linh sống nhờ nó: nói thật mơ hồ
                        để ai nghe cũng thấy trúng.{' '}
                        <strong className="text-foreground">
                          Vì vậy: "đúng quá mức" là dấu hiệu để NGHI NGỜ — không phải để tin.
                        </strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase 3 — manifesto card */}
                <Card className="border-gold/40 bg-gradient-to-br from-gold/[0.08] to-transparent">
                  <CardContent className="p-6">
                    <p className="mb-4 font-heading text-base font-semibold text-foreground">
                      hieu.asia làm ngược lại — đó là "không bói mù":
                    </p>
                    <ul className="space-y-3 text-sm leading-relaxed text-foreground/85">
                      <li className="flex gap-2">
                        <span className="mt-0.5 shrink-0 text-gold">·</span>
                        <span>
                          <strong className="text-foreground">Mô tả cụ thể, dám sai</strong> — không nói
                          chung chung để ai cũng thấy đúng.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 shrink-0 text-gold">·</span>
                        <span>
                          <strong className="text-foreground">Trích nguồn cổ thư</strong> — bạn xem được
                          luận giải dựa vào đâu, không phải "thầy phán".
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 shrink-0 text-gold">·</span>
                        <span>
                          <strong className="text-foreground">
                            Mời bạn tự chấm khắt khe và tự quyết
                          </strong>{' '}
                          — chúng tôi không phán số mệnh; chỉ đưa góc nhìn để bạn hiểu mình rõ hơn.
                        </span>
                      </li>
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild variant="default" className="bg-gold text-background hover:bg-gold/90">
                        <a href="/methodology">Xem cách chúng tôi luận giải →</a>
                      </Button>
                      <Button asChild variant="outline">
                        <a href="/cong-cu">Thử một công cụ thật →</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase 4 — thử trên kết quả THẬT của bạn (V2) */}
                <Card className="border-border bg-card/50">
                  <CardContent className="p-6">
                    <p className="font-heading text-base font-semibold text-foreground">
                      Giờ thử với chính kết quả của bạn
                    </p>
                    {personalSummary ? (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                          Ngược với 10 câu mơ hồ ở trên, đây là kết quả{' '}
                          <strong className="text-foreground">cụ thể</strong> bạn đã tự làm — cụ thể
                          nên <strong className="text-foreground">dám sai</strong>:
                        </p>
                        <blockquote className="mt-3 border-l-2 border-gold/60 pl-3 text-sm italic leading-relaxed text-foreground/90">
                          {personalSummary}
                        </blockquote>
                        <p className="mt-4 text-sm text-foreground/85">
                          Tự chấm khắt khe — nó đúng với bạn tới đâu?
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(
                            [
                              ['yes', 'Đúng với tôi'],
                              ['partial', 'Đúng một phần'],
                              ['no', 'Chưa đúng'],
                            ] as const
                          ).map(([k, label]) => (
                            <Button
                              key={k}
                              size="sm"
                              variant={selfRate === k ? 'default' : 'outline'}
                              onClick={() => {
                                setSelfRate(k);
                                track('tool_used', { tool: 'tu-kiem', result: 'self-check' });
                              }}
                              className={
                                selfRate === k
                                  ? 'bg-gold text-background hover:bg-gold/90'
                                  : 'border-border/60 text-foreground/70 hover:border-gold/50 hover:text-gold'
                              }
                            >
                              {label}
                            </Button>
                          ))}
                        </div>
                        {selfRate && (
                          <p className="mt-4 rounded-md border border-gold/20 bg-gold/[0.05] p-3 text-sm leading-relaxed text-foreground/90">
                            {selfRate === 'yes'
                              ? 'Tốt — nhưng nhớ bài vừa rồi: đừng tin chỉ vì thấy “đúng ghê”. Cái này cụ thể nên đáng tin hơn lời mơ hồ, song bạn vẫn là người quyết định nó có ý nghĩa gì với đời mình.'
                              : selfRate === 'partial'
                                ? 'Chuẩn rồi — đúng một phần là điều bình thường và lành mạnh. Công cụ trung thực thì cụ thể, mà đã cụ thể thì phải có chỗ chưa khớp. Bạn giữ phần đúng, bỏ phần không hợp.'
                                : 'Đây là dấu hiệu TỐT, không phải lỗi: vì cụ thể nên nó dám sai. Một lời bói mơ hồ sẽ chẳng bao giờ để bạn nói “chưa đúng”. Hãy tin vào trải nghiệm của chính bạn.'}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                          Bạn chưa làm trắc nghiệm nào ở đây. Hãy làm một bài{' '}
                          <strong className="text-foreground">cụ thể, dám sai</strong> (không phải mô
                          tả mơ hồ), rồi quay lại trang này để tự chấm xem nó đúng với bạn tới đâu.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button asChild variant="outline">
                            <a href="/enneagram">Trắc nghiệm Enneagram →</a>
                          </Button>
                          <Button asChild variant="outline">
                            <a href="/mbti">Trắc nghiệm MBTI →</a>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-3 pt-1">
                  <ShareResultButton
                    path="/tu-kiem"
                    title="Đừng tin mù — bài tự kiểm 1 phút | hieu.asia"
                    text='Tôi vừa làm bài "Đừng tin mù" — 1 phút để hiểu vì sao lời bói luôn thấy "đúng ghê". Bạn thử xem.'
                    trackId="tu-kiem"
                  />
                  <Button variant="outline" onClick={handleReset}>
                    Làm lại
                  </Button>
                </div>

                <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                  Bài này dựa trên thí nghiệm Forer (1948) về hiệu ứng Barnum — một khái niệm tâm lý học,
                  không phải bói toán.
                </p>
              </>
            )}
          </div>
        </section>
      </ToolPageShell>
      <StickyMobileCta trackId="tu-kiem" />
    </>
  );
}
