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
  checkBuildYear,
  goodBuildYearsFrom,
  BUILD_VERDICT_LABEL,
  type BuildYearResult,
} from '@/lib/xem-tuoi-lam-nha';
import { track } from '@/lib/analytics';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';

const VERDICT_CLASS: Record<BuildYearResult['verdict'], string> = {
  'thuan': 'text-emerald-700 dark:text-emerald-300',
  'can-nhac': 'text-amber-700 dark:text-amber-300',
  'pham': 'text-rose-700 dark:text-rose-300',
};

const VERDICT_EMOJI: Record<BuildYearResult['verdict'], string> = {
  'thuan': '✅',
  'can-nhac': '⚠️',
  'pham': '🔻',
};

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1940 && y <= 2010 ? y : null;
}

function PersonResult({ title, result }: { title: string; result: BuildYearResult }) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="text-sm text-muted-foreground">
        {title} sinh năm{' '}
        <strong className="text-foreground">
          {result.birthYear} ({result.birthCanChi.name} — tuổi {result.birthCanChi.animal})
        </strong>
        , làm nhà năm{' '}
        <strong className="text-foreground">
          {result.targetYear} ({result.targetCanChi.name})
        </strong>
        :
      </p>
      <p className={`mt-2 text-base font-semibold ${VERDICT_CLASS[result.verdict]}`}>
        {VERDICT_EMOJI[result.verdict]} {BUILD_VERDICT_LABEL[result.verdict]}
      </p>
      <ul className="mt-2 space-y-1 pl-5 text-sm text-muted-foreground list-disc">
        {result.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export function XemTuoiLamNhaChecker({
  defaultBirthYear,
  defaultTargetYear = 2026,
}: {
  defaultBirthYear?: number;
  defaultTargetYear?: number;
} = {}) {
  const [ownerValue, setOwnerValue] = React.useState(defaultBirthYear ? String(defaultBirthYear) : '');
  const [borrowValue, setBorrowValue] = React.useState('');
  const [targetValue, setTargetValue] = React.useState(String(defaultTargetYear));
  const [reportInterest, setReportInterest] = React.useState(false);

  const ownerYear = parseYear(ownerValue);
  const borrowYear = parseYear(borrowValue);
  const targetYear = React.useMemo(() => {
    const y = Number(targetValue);
    return Number.isInteger(y) && y >= 2024 && y <= 2040 ? y : null;
  }, [targetValue]);

  const ownerResult = React.useMemo(
    () => (ownerYear && targetYear ? checkBuildYear(ownerYear, targetYear) : null),
    [ownerYear, targetYear],
  );
  const borrowResult = React.useMemo(
    () => (borrowYear && targetYear ? checkBuildYear(borrowYear, targetYear) : null),
    [borrowYear, targetYear],
  );
  const goodYears = React.useMemo(
    () => (ownerYear && targetYear ? goodBuildYearsFrom(ownerYear, targetYear) : []),
    [ownerYear, targetYear],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiểm tra năm làm nhà theo tuổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="xtlnOwner">Năm sinh gia chủ</Label>
            <Input
              id="xtlnOwner"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1990"
              value={ownerValue}
              onChange={(e) => setOwnerValue(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="xtlnTarget">Năm dự định làm nhà</Label>
            <Input
              id="xtlnTarget"
              type="number"
              inputMode="numeric"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="xtlnBorrow">Năm sinh người mượn tuổi (tuỳ chọn)</Label>
            <Input
              id="xtlnBorrow"
              type="number"
              inputMode="numeric"
              placeholder="Nếu định mượn tuổi"
              value={borrowValue}
              onChange={(e) => setBorrowValue(e.target.value)}
            />
          </div>
        </div>

        {!ownerResult && (
          <p className="text-sm text-muted-foreground">
            Nhập năm sinh (dương lịch) của gia chủ để xem năm dự định xây/sửa nhà có phạm Kim Lâu,
            Hoang Ốc hay Tam Tai không — kèm cách tính cụ thể, không phán mơ hồ.
          </p>
        )}

        {ownerResult && (
          <div className="space-y-4">
            <PersonResult title="Gia chủ" result={ownerResult} />
            {borrowResult && (
              <>
                <PersonResult title="Người được mượn tuổi" result={borrowResult} />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Theo tục, người được mượn tuổi cũng phải <strong>không phạm cả ba hạn</strong>{' '}
                  (Kim Lâu, Hoang Ốc, Tam Tai) trong năm khởi công thì việc mượn tuổi mới được coi
                  là trọn vẹn — thường chọn nam giới lớn tuổi hơn gia chủ.
                </p>
              </>
            )}

            {goodYears.length > 0 && ownerResult.verdict !== 'thuan' && (
              <p className="text-sm text-muted-foreground">
                Các năm gần nhất <strong className="text-foreground">không phạm hạn thường xét</strong>{' '}
                cho gia chủ {ownerResult.birthYear}: {goodYears.join(', ')}.
              </p>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Kim Lâu, Hoang Ốc hay Tam Tai là <strong>tập tục dân gian</strong>, không phải quy
              luật khoa học. Chúng tôi tính minh bạch từng bước để bạn <strong>biết rõ vì sao</strong>{' '}
              có kết luận đó và tự quyết định — không doạ, không bán &ldquo;giải hạn&rdquo;. Những
              yếu tố thật sự quyết định vẫn là tài chính, giấy phép và mùa thi công. Lưu ý: tuổi mụ
              tính theo năm âm lịch; nếu bạn sinh tháng 1–2 trước Tết, năm âm của bạn là năm liền
              trước năm dương.
            </p>

            {/* Hạt giống đo nhu cầu "báo cáo khởi công chi tiết" — không backend, chỉ ghi ý định qua analytics. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:lam-nha"
                    capturedEvent="lam_nha_lead_captured"
                    capturedProps={{ targetYear: ownerResult.targetYear, verdict: ownerResult.verdict }}
                    blurb="Bản đầy đủ sẽ gợi ý ngày khởi công đẹp theo tuổi gia chủ, kèm giờ động thổ. Để email, chúng tôi gửi bạn ngay khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                  <p className="text-sm text-muted-foreground">
                    Trong lúc chờ, bạn có thể{' '}
                    <Link href="/xem-ngay/dong-tho" className="text-gold hover:underline">
                      chấm điểm từng ngày động thổ (miễn phí)
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
                      Cần chọn ngày động thổ chi tiết?
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ gợi ý <strong>ngày khởi công đẹp theo tuổi gia chủ</strong>{' '}
                      trong tháng bạn định làm: ngày hoàng đạo, tránh ngày xung tuổi, kèm giờ động
                      thổ — giải thích rõ từng lý do.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('lam_nha_report_intent', {
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
