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
  checkOpeningYear,
  goodOpeningYearsFrom,
  OPENING_VERDICT_LABEL,
  type OpeningYearResult,
} from '@/lib/khai-truong';
import { track } from '@/lib/analytics';
import { useScrollToResult } from '@/lib/use-scroll-to-result';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';

const VERDICT_CLASS: Record<OpeningYearResult['verdict'], string> = {
  'thuan': 'text-emerald-700 dark:text-emerald-300',
  'can-nhac': 'text-amber-700 dark:text-amber-300',
  'pham': 'text-rose-700 dark:text-rose-300',
};

const VERDICT_EMOJI: Record<OpeningYearResult['verdict'], string> = {
  'thuan': '✅',
  'can-nhac': '⚠️',
  'pham': '🔻',
};

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1940 && y <= 2010 ? y : null;
}

function OwnerResult({ result }: { result: OpeningYearResult }) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="text-sm text-muted-foreground">
        Chủ kinh doanh sinh năm{' '}
        <strong className="text-foreground">
          {result.birthYear} ({result.birthCanChi.name} — tuổi {result.birthCanChi.animal})
        </strong>
        , khai trương năm{' '}
        <strong className="text-foreground">
          {result.targetYear} ({result.targetCanChi.name})
        </strong>
        :
      </p>
      <p className={`mt-2 text-base font-semibold ${VERDICT_CLASS[result.verdict]}`}>
        {VERDICT_EMOJI[result.verdict]} {OPENING_VERDICT_LABEL[result.verdict]}
      </p>
      <ul className="mt-2 space-y-1 pl-5 text-sm text-muted-foreground list-disc">
        {result.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export function KhaiTruongChecker({
  defaultBirthYear,
  defaultTargetYear = 2026,
}: {
  defaultBirthYear?: number;
  defaultTargetYear?: number;
} = {}) {
  const [ownerValue, setOwnerValue] = React.useState(defaultBirthYear ? String(defaultBirthYear) : '');
  const [targetValue, setTargetValue] = React.useState(String(defaultTargetYear));
  const [reportInterest, setReportInterest] = React.useState(false);

  const ownerYear = parseYear(ownerValue);
  const targetYear = React.useMemo(() => {
    const y = Number(targetValue);
    return Number.isInteger(y) && y >= 2024 && y <= 2040 ? y : null;
  }, [targetValue]);

  const ownerResult = React.useMemo(
    () => (ownerYear && targetYear ? checkOpeningYear(ownerYear, targetYear) : null),
    [ownerYear, targetYear],
  );
  const goodYears = React.useMemo(
    () => (ownerYear && targetYear ? goodOpeningYearsFrom(ownerYear, targetYear) : []),
    [ownerYear, targetYear],
  );

  const { resultRef, armScroll } = useScrollToResult(ownerResult);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiểm tra năm khai trương theo tuổi chủ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="ktOwner">Năm sinh chủ kinh doanh</Label>
            <Input
              id="ktOwner"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1990"
              value={ownerValue}
              onChange={(e) => {
                setOwnerValue(e.target.value);
                armScroll();
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ktTarget">Năm dự định khai trương</Label>
            <Input
              id="ktTarget"
              type="number"
              inputMode="numeric"
              value={targetValue}
              onChange={(e) => {
                setTargetValue(e.target.value);
                armScroll();
              }}
            />
          </div>
        </div>

        {!ownerResult && (
          <p className="text-sm text-muted-foreground">
            Nhập năm sinh (dương lịch) của người đứng tên kinh doanh để xem năm dự định khai trương /
            mở hàng có vướng Tam Tai hay xung tuổi không — kèm cách tính cụ thể, không phán mơ hồ.
          </p>
        )}

        {ownerResult && (
          <div ref={resultRef} className="scroll-mt-24 space-y-4">
            <OwnerResult result={ownerResult} />

            {goodYears.length > 0 && ownerResult.verdict !== 'thuan' && (
              <p className="text-sm text-muted-foreground">
                Các năm gần nhất <strong className="text-foreground">hợp tuổi khai trương</strong>{' '}
                cho chủ {ownerResult.birthYear}: {goodYears.join(', ')}.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <DownloadToolPdfButton
                source="pdf-khai-truong"
                payload={() => {
                  if (!ownerResult) return null;
                  const r = ownerResult;
                  const sections: ToolPdfPayload['sections'] = [
                    {
                      heading: 'Thông tin xem tuổi',
                      rows: [
                        {
                          label: 'Chủ kinh doanh',
                          value: `${r.birthYear} — ${r.birthCanChi.name} (tuổi ${r.birthCanChi.animal})`,
                        },
                        {
                          label: 'Năm dự định khai trương',
                          value: `${r.targetYear} — ${r.targetCanChi.name}`,
                        },
                      ],
                    },
                    {
                      heading: 'Các hạn dân gian xét cho khai trương',
                      rows: [
                        {
                          label: 'Tam Tai',
                          value: r.tamTai.isTamTai
                            ? `Vướng — năm ${r.tamTai.yearChi} thuộc 3 năm Tam Tai (${r.tamTai.tamTaiChis.join(', ')}) của tuổi ${r.tamTai.birthChi}`
                            : `Không vướng — năm ${r.tamTai.yearChi} ngoài 3 năm Tam Tai (${r.tamTai.tamTaiChis.join(', ')}) của tuổi ${r.tamTai.birthChi}`,
                        },
                        {
                          label: 'Xung Thái Tuế',
                          value: r.xung.isXung
                            ? `Có — chi năm ${r.xung.yearChi} lục xung chi tuổi ${r.xung.birthChi}`
                            : r.xung.isNamTuoi
                              ? `Năm tuổi — chi năm ${r.xung.yearChi} trùng chi tuổi (lưu ý nhẹ)`
                              : `Không xung — chi năm ${r.xung.yearChi} không xung chi tuổi ${r.xung.birthChi}`,
                        },
                        {
                          label: 'Kim Lâu / Hoang Ốc',
                          value: 'Không xét (dành cho xây nhà và cưới hỏi)',
                        },
                      ],
                    },
                    {
                      heading: 'Cách tính từng bước',
                      text: r.reasons.join('\n'),
                    },
                  ];

                  if (goodYears.length > 0 && r.verdict !== 'thuan') {
                    sections.push({
                      heading: 'Năm hợp tuổi khai trương gần nhất',
                      text: `Cho chủ sinh năm ${r.birthYear}, các năm gần nhất không vướng Tam Tai hay xung tuổi: ${goodYears.join(', ')}.`,
                    });
                  }

                  sections.push({
                    heading: 'Lưu ý',
                    text:
                      'Tam Tai và xung Thái Tuế là tập tục dân gian để tham khảo, không phải quy luật khoa học. ' +
                      'Bản tính này minh bạch từng bước để bạn tự quyết định — không doạ, không bán "giải hạn". ' +
                      'Nếu chủ sinh tháng 1–2 dương trước Tết, năm âm là năm liền trước (nhập lùi 1 năm). ' +
                      'Bước tiếp theo là chọn NGÀY GIỜ khai trương đẹp tại hieu.asia/xem-ngay/khai-truong.',
                  });

                  return {
                    title: 'Xem tuổi khai trương — hieu.asia',
                    subtitle: `Chủ ${r.birthYear} (${r.birthCanChi.name}) · khai trương năm ${r.targetYear} (${r.targetCanChi.name})`,
                    hero: {
                      big: `${VERDICT_EMOJI[r.verdict]} ${OPENING_VERDICT_LABEL[r.verdict]}`,
                      small: `Năm ${r.targetYear} cho chủ tuổi ${r.birthCanChi.animal} (${r.birthYear})`,
                    },
                    sections,
                    cta: { url: 'https://hieu.asia/xem-ngay/khai-truong' },
                  };
                }}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Tam Tai và xung Thái Tuế là <strong>tập tục dân gian</strong>, không phải quy luật
              khoa học. Chúng tôi tính minh bạch từng bước để bạn <strong>biết rõ vì sao</strong> có
              kết luận đó và tự quyết định — không doạ, không bán &ldquo;giải hạn&rdquo;. Xem tuổi
              khai trương <strong>không xét Kim Lâu / Hoang Ốc</strong> (hai hạn đó dành cho xây nhà
              và cưới hỏi). Lưu ý: nếu chủ sinh tháng 1–2 dương trước Tết, năm âm là năm liền trước
              (nhập lùi 1 năm).
            </p>

            {/* Hạt giống đo nhu cầu "báo cáo khai trương chi tiết" — không backend, chỉ ghi ý định qua analytics. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:khai-truong"
                    capturedEvent="khai_truong_lead_captured"
                    capturedProps={{ targetYear: ownerResult.targetYear, verdict: ownerResult.verdict }}
                    blurb="Bản đầy đủ sẽ gợi ý ngày giờ khai trương đẹp theo tuổi chủ kinh doanh, tránh ngày xung tuổi. Để email, chúng tôi gửi bạn ngay khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                  <p className="text-sm text-muted-foreground">
                    Trong lúc chờ, bạn có thể{' '}
                    <Link href="/xem-ngay/khai-truong" className="text-gold hover:underline">
                      chấm điểm từng ngày khai trương (miễn phí)
                    </Link>{' '}
                    hoặc xem{' '}
                    <Link href="/gio-hoang-dao" className="text-gold hover:underline">
                      giờ hoàng đạo trong ngày
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Cần chọn ngày giờ khai trương chi tiết?
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ gợi ý <strong>ngày mở hàng đẹp theo tuổi chủ</strong> trong tháng
                      bạn định khai trương: ngày hoàng đạo, tránh ngày xung tuổi, kèm giờ tốt — giải
                      thích rõ từng lý do.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('khai_truong_report_intent', {
                        birthYear: ownerResult.birthYear,
                        targetYear: ownerResult.targetYear,
                        verdict: ownerResult.verdict,
                      });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>

            <nav aria-label="Bước chọn ngày khai trương" className="text-sm">
              <span className="text-muted-foreground">Đã xem tuổi xong? Bước tiếp là chọn NGÀY: </span>
              <Link href="/xem-ngay/khai-truong" className="text-gold hover:underline">
                Xem ngày khai trương đẹp (chấm điểm từng ngày)
              </Link>
            </nav>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
