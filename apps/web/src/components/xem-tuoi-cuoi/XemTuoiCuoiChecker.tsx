'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@hieu-asia/ui';
import {
  checkWeddingYear,
  goodYearsFrom,
  VERDICT_LABEL,
  type WeddingYearResult,
} from '@/lib/xem-tuoi-cuoi';
import { track } from '@/lib/analytics';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import { useScrollToResult } from '@/lib/use-scroll-to-result';

const VERDICT_CLASS: Record<WeddingYearResult['verdict'], string> = {
  'thuan': 'text-emerald-700 dark:text-emerald-300',
  'can-nhac': 'text-amber-700 dark:text-amber-300',
  'pham': 'text-rose-700 dark:text-rose-300',
};

const VERDICT_EMOJI: Record<WeddingYearResult['verdict'], string> = {
  'thuan': '✅',
  'can-nhac': '⚠️',
  'pham': '🔻',
};

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1940 && y <= 2015 ? y : null;
}

function PersonResult({ title, result, kimLauApplies }: { title: string; result: WeddingYearResult; kimLauApplies: boolean }) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="text-sm text-muted-foreground">
        {title} sinh năm{' '}
        <strong className="text-foreground">
          {result.birthYear} ({result.birthCanChi.name} — tuổi {result.birthCanChi.animal})
        </strong>
        , cưới năm <strong className="text-foreground">{result.targetYear} ({result.targetCanChi.name})</strong>:
      </p>
      <p className={`mt-2 text-base font-semibold ${VERDICT_CLASS[result.verdict]}`}>
        {VERDICT_EMOJI[result.verdict]} {VERDICT_LABEL[result.verdict]}
      </p>
      <ul className="mt-2 space-y-1 pl-5 text-sm text-muted-foreground list-disc">
        {result.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      {!kimLauApplies && (
        <p className="mt-2 text-xs text-muted-foreground">
          Theo tục phổ biến, Kim Lâu xét chủ yếu tuổi cô dâu — kết quả Kim Lâu ở trên chỉ để tham khảo
          nếu gia đình bạn xét cả hai người.
        </p>
      )}
    </div>
  );
}

export function XemTuoiCuoiChecker({
  defaultBrideYear,
  defaultTargetYear = 2026,
}: {
  defaultBrideYear?: number;
  defaultTargetYear?: number;
} = {}) {
  const [brideValue, setBrideValue] = React.useState(defaultBrideYear ? String(defaultBrideYear) : '');
  const [groomValue, setGroomValue] = React.useState('');
  const [targetValue, setTargetValue] = React.useState(String(defaultTargetYear));
  const [reportInterest, setReportInterest] = React.useState(false);

  const brideYear = parseYear(brideValue);
  const groomYear = parseYear(groomValue);
  const targetYear = React.useMemo(() => {
    const y = Number(targetValue);
    return Number.isInteger(y) && y >= 2024 && y <= 2040 ? y : null;
  }, [targetValue]);

  const brideResult = React.useMemo(
    () => (brideYear && targetYear ? checkWeddingYear(brideYear, targetYear) : null),
    [brideYear, targetYear],
  );
  const groomResult = React.useMemo(
    () => (groomYear && targetYear ? checkWeddingYear(groomYear, targetYear) : null),
    [groomYear, targetYear],
  );
  const goodYears = React.useMemo(
    () => (brideYear && targetYear ? goodYearsFrom(brideYear, targetYear) : []),
    [brideYear, targetYear],
  );

  const { resultRef, armScroll } = useScrollToResult(brideResult);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiểm tra năm cưới theo tuổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="xtcBride">Năm sinh cô dâu</Label>
            <Input
              id="xtcBride"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1997"
              value={brideValue}
              onChange={(e) => {
                armScroll();
                setBrideValue(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="xtcGroom">Năm sinh chú rể (tuỳ chọn)</Label>
            <Input
              id="xtcGroom"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1995"
              value={groomValue}
              onChange={(e) => setGroomValue(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="xtcTarget">Năm dự định cưới</Label>
            <Input
              id="xtcTarget"
              type="number"
              inputMode="numeric"
              value={targetValue}
              onChange={(e) => {
                armScroll();
                setTargetValue(e.target.value);
              }}
            />
          </div>
        </div>

        {!brideResult && (
          <p className="text-sm text-muted-foreground">
            Nhập năm sinh (dương lịch) của cô dâu để xem năm cưới có phạm Kim Lâu, Tam Tai hay xung
            năm không — kèm cách tính cụ thể, không phán mơ hồ.
          </p>
        )}

        {brideResult && (
          <div ref={resultRef} className="scroll-mt-24 space-y-4">
            <PersonResult title="Cô dâu" result={brideResult} kimLauApplies />
            {groomResult && <PersonResult title="Chú rể" result={groomResult} kimLauApplies={false} />}

            {goodYears.length > 0 && brideResult.verdict !== 'thuan' && (
              <p className="text-sm text-muted-foreground">
                Các năm gần nhất <strong className="text-foreground">không phạm hạn thường xét</strong>{' '}
                cho cô dâu {brideResult.birthYear}: {goodYears.join(', ')}.
              </p>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Kim Lâu, Tam Tai hay xung năm là <strong>tập tục dân gian</strong>, không phải quy luật
              khoa học. Chúng tôi tính minh bạch từng bước để bạn <strong>biết rõ vì sao</strong> có
              kết luận đó và tự quyết định — không doạ, không bán &ldquo;giải hạn&rdquo;. Lưu ý: tuổi
              mụ tính theo năm âm lịch; nếu bạn sinh tháng 1–2 trước Tết, năm âm của bạn là năm liền
              trước năm dương.
            </p>

            {/* Hạt giống đo nhu cầu "báo cáo ngày cưới chi tiết" — không backend, chỉ ghi ý định qua analytics. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:xem-tuoi-cuoi"
                    capturedEvent="cuoi_lead_captured"
                    capturedProps={{ targetYear: brideResult.targetYear, verdict: brideResult.verdict }}
                    blurb="Bản đầy đủ sẽ gợi ý ngày cưới đẹp theo tuổi cả hai bạn, kèm giờ đón dâu. Để email, chúng tôi gửi bạn ngay khi ra mắt — kèm vài mẹo chọn ngày cưới."
                    cta="Báo tôi khi có"
                  />
                  <p className="text-sm text-muted-foreground">
                    Trong lúc chờ, bạn có thể{' '}
                    <Link href="/xem-ngay/cuoi-hoi" className="text-gold hover:underline">
                      chấm điểm từng ngày cưới (miễn phí)
                    </Link>{' '}
                    hoặc xem{' '}
                    <Link href="/hop-tuoi" className="text-gold hover:underline">
                      hợp tuổi hai bạn
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Cần chọn ngày cưới chi tiết?</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ gợi ý <strong>ngày cưới đẹp theo tuổi cả hai bạn</strong> trong
                      tháng bạn định cưới: ngày hoàng đạo, tránh ngày xung tuổi, kèm giờ đón dâu —
                      giải thích rõ từng lý do.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('cuoi_report_intent', {
                        brideYear: brideResult.birthYear,
                        targetYear: brideResult.targetYear,
                        verdict: brideResult.verdict,
                      });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DownloadToolPdfButton
                source="pdf-xem-tuoi-cuoi"
                payload={() => {
                  if (!brideResult) return null;

                  const verdictLine = (r: WeddingYearResult) =>
                    `${VERDICT_EMOJI[r.verdict]} ${VERDICT_LABEL[r.verdict]}`;

                  // Từng hạn dân gian → một dòng kết quả thật từ engine (không bịa).
                  const checkRows = (
                    r: WeddingYearResult,
                  ): NonNullable<ToolPdfPayload['sections'][number]['rows']> => [
                    {
                      label: 'Kim Lâu (tuổi mụ chia 9)',
                      value: r.kimLau.type
                        ? `Phạm ${r.kimLau.type} — tuổi mụ ${r.kimLau.ageMu}, dư ${r.kimLau.remainder}`
                        : `Không phạm — tuổi mụ ${r.kimLau.ageMu}, dư ${r.kimLau.remainder}`,
                    },
                    {
                      label: 'Tam Tai',
                      value: r.tamTai.isTamTai
                        ? `Phạm — năm ${r.tamTai.yearChi} thuộc nhóm Tam Tai (${r.tamTai.tamTaiChis.join(', ')})`
                        : `Không phạm — năm ${r.tamTai.yearChi} ngoài nhóm (${r.tamTai.tamTaiChis.join(', ')})`,
                    },
                    {
                      label: 'Xung năm (lục xung)',
                      value: r.xung.isXung
                        ? `Lục xung — chi năm ${r.xung.yearChi} xung chi tuổi ${r.xung.birthChi}`
                        : r.xung.isNamTuoi
                          ? `Năm tuổi (trùng chi ${r.xung.yearChi}) — chỉ là lưu ý nhẹ`
                          : `Không xung — chi năm ${r.xung.yearChi}, chi tuổi ${r.xung.birthChi}`,
                    },
                  ];

                  const sections: ToolPdfPayload['sections'] = [
                    {
                      heading: `Cô dâu sinh năm ${brideResult.birthYear} (${brideResult.birthCanChi.name} — tuổi ${brideResult.birthCanChi.animal})`,
                      rows: checkRows(brideResult),
                    },
                    {
                      heading: 'Diễn giải từng bước (cô dâu)',
                      text: brideResult.reasons.join('\n'),
                    },
                  ];

                  if (groomResult) {
                    sections.push(
                      {
                        heading: `Chú rể sinh năm ${groomResult.birthYear} (${groomResult.birthCanChi.name} — tuổi ${groomResult.birthCanChi.animal}) — ${verdictLine(groomResult)}`,
                        rows: checkRows(groomResult),
                      },
                      {
                        heading: 'Diễn giải từng bước (chú rể)',
                        text: groomResult.reasons.join('\n'),
                      },
                    );
                  }

                  if (goodYears.length > 0 && brideResult.verdict !== 'thuan') {
                    sections.push({
                      heading: 'Vẫn cưới được — chọn năm không phạm',
                      text:
                        `Nếu muốn tránh hạn thường xét, các năm gần nhất không phạm cho cô dâu ${brideResult.birthYear} là: ` +
                        `${goodYears.join(', ')}.\n` +
                        'Đây là tập tục dân gian để tham khảo — bạn hoàn toàn có thể cưới vào năm mình muốn.',
                    });
                  }

                  sections.push({
                    heading: 'Lưu ý',
                    text:
                      'Kim Lâu, Tam Tai hay xung năm là tập tục dân gian, không phải quy luật khoa học. ' +
                      'Chúng tôi tính minh bạch từng bước để bạn biết rõ vì sao có kết luận đó và tự quyết định — không doạ, không bán "giải hạn". ' +
                      'Tuổi mụ tính theo năm âm lịch; nếu sinh tháng 1–2 trước Tết, năm âm của bạn là năm liền trước năm dương.',
                  });

                  return {
                    title: 'Xem tuổi cưới — hieu.asia',
                    subtitle: `Cô dâu ${brideResult.birthYear}${groomResult ? ` · chú rể ${groomResult.birthYear}` : ''} · dự định cưới năm ${brideResult.targetYear} (${brideResult.targetCanChi.name})`,
                    hero: {
                      big: verdictLine(brideResult),
                      small: `Cô dâu ${brideResult.birthYear} cưới năm ${brideResult.targetYear} (${brideResult.targetCanChi.name})`,
                    },
                    sections,
                  };
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
