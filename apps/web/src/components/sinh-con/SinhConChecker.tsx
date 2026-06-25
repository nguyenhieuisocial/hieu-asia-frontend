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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hieu-asia/ui';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import {
  checkParentChild,
  yearProfile,
  type ParentCheck,
  type RelationTone,
} from '@/lib/sinh-con';
import { track } from '@/lib/analytics';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';

const CHILD_YEARS = [2026, 2027, 2028] as const;

const TONE_CLASS: Record<RelationTone, string> = {
  hop: 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20',
  'luu-y': 'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20',
  'trung-tinh': 'border-border bg-card/40',
};

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1900 && y <= 2100 ? y : null;
}

function ParentResult({
  title,
  check,
  childTen,
}: {
  title: string;
  check: ParentCheck;
  childTen: string;
}) {
  return (
    <div className={`rounded-md border p-3 ${TONE_CLASS[check.relationCopy.tone]}`}>
      <div className="text-sm font-medium text-foreground">
        {title} — {check.parent.canChi} ({check.parent.year}), tuổi {check.parent.zodiac.ten}{' '}
        <span aria-hidden="true">{check.parent.zodiac.emoji}</span> · mệnh{' '}
        {ELEMENTS[check.parent.element].name} ({check.parent.napAmName})
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">{check.relationCopy.label}.</strong>{' '}
        {check.relationCopy.text(check.parent.zodiac.ten, childTen)}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{check.menh.text}</p>
    </div>
  );
}

export function SinhConChecker({ defaultYear = 2027 }: { defaultYear?: number } = {}) {
  const [childYear, setChildYear] = React.useState(String(defaultYear));
  const [meYear, setMeYear] = React.useState('');
  const [boYear, setBoYear] = React.useState('');
  const [reportInterest, setReportInterest] = React.useState(false);

  const child = React.useMemo(() => yearProfile(Number(childYear)), [childYear]);
  const me = React.useMemo(() => {
    const y = parseYear(meYear);
    return y ? checkParentChild(y, Number(childYear)) : null;
  }, [meYear, childYear]);
  const bo = React.useMemo(() => {
    const y = parseYear(boYear);
    return y ? checkParentChild(y, Number(childYear)) : null;
  }, [boYear, childYear]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đối chiếu tuổi bố mẹ &amp; bé theo năm sinh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="scChildYear">Bé dự kiến sinh năm</Label>
            <Select value={childYear} onValueChange={setChildYear}>
              <SelectTrigger id="scChildYear">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHILD_YEARS.map((y) => {
                  const p = yearProfile(y);
                  return (
                    <SelectItem key={y} value={String(y)}>
                      {y} — {p?.canChi}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="scMeYear">Năm sinh mẹ (âm lịch)</Label>
            <Input
              id="scMeYear"
              type="number"
              inputMode="numeric"
              placeholder="vd 1996"
              value={meYear}
              onChange={(e) => setMeYear(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="scBoYear">Năm sinh bố (âm lịch)</Label>
            <Input
              id="scBoYear"
              type="number"
              inputMode="numeric"
              placeholder="vd 1993"
              value={boYear}
              onChange={(e) => setBoYear(e.target.value)}
            />
          </div>
        </div>

        {child && (
          <div className="rounded-lg border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">
              Bé sinh năm <strong className="text-foreground">{child.year}</strong> là năm{' '}
              <strong className="text-foreground">
                {child.canChi} — tuổi {child.zodiac.ten}{' '}
                <span aria-hidden="true">{child.zodiac.emoji}</span>
              </strong>
              , mệnh{' '}
              <strong className="text-gold">
                {ELEMENTS[child.element].name} — {child.napAmName}
              </strong>
              . {ELEMENTS[child.element].blurb}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Lưu ý: tuổi tính theo <strong>năm âm lịch</strong> — bé sinh tháng 1–2 dương (trước
              Tết) thuộc năm âm liền trước. Năm sinh bố mẹ cũng hiểu theo năm âm.
            </p>
          </div>
        )}

        {(me || bo) && (
          <div className="space-y-3">
            {me && child && <ParentResult title="Mẹ" check={me} childTen={child.zodiac.ten} />}
            {bo && child && <ParentResult title="Bố" check={bo} childTen={child.zodiac.ten} />}
            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là <strong>đối chiếu theo quan niệm Can Chi &amp; ngũ hành để tham khảo</strong> —
              không phải lời phán. Em bé nào cũng là phúc của gia đình; nhóm "lưu ý" chỉ gợi ý bố mẹ
              thêm kiên nhẫn, tuyệt đối không có chuyện con "khắc" hay mang lỗi với cha mẹ.
            </p>
          </div>
        )}

        {child && (me || bo) && (
          <>
            <nav aria-label="Công cụ liên quan" className="text-sm">
              <span className="text-muted-foreground">Bước tiếp theo: </span>
              <Link
                href={
                  child.year === 2026
                    ? '/dat-ten-ngu-hanh/sinh-nam-2026'
                    : '/dat-ten-ngu-hanh'
                }
                className="text-gold hover:underline"
              >
                gợi ý đặt tên hợp mệnh bé
              </Link>
              <span className="text-muted-foreground">{' · '}</span>
              <Link href="/xem-hop-nhom" className="text-gold hover:underline">
                xem hợp cả nhà (≥3 người)
              </Link>
              <span className="text-muted-foreground">{' · '}</span>
              <Link href="/xem-ngay" className="text-gold hover:underline">
                xem ngày tốt đón bé
              </Link>
            </nav>

            <DownloadToolPdfButton
              source="pdf-sinh-con"
              payload={() => {
                if (!child) return null;
                const childEl = ELEMENTS[child.element];
                const sections: ToolPdfPayload['sections'] = [
                  {
                    heading: 'Mệnh & con giáp của bé',
                    rows: [
                      { label: 'Năm sinh (âm lịch)', value: `${child.year} — ${child.canChi}` },
                      {
                        label: 'Con giáp',
                        value: `${child.zodiac.ten} ${child.zodiac.emoji}`,
                      },
                      {
                        label: 'Mệnh (nạp âm)',
                        value: `${childEl.name} — ${child.napAmName}`,
                      },
                    ],
                  },
                  { heading: 'Về mệnh của bé', text: childEl.blurb },
                ];

                if (me) {
                  const meEl = ELEMENTS[me.parent.element];
                  sections.push({
                    heading: `Đối chiếu với mẹ (${me.parent.canChi} ${me.parent.year})`,
                    rows: [
                      {
                        label: 'Tuổi & mệnh mẹ',
                        value: `${me.parent.zodiac.ten} ${me.parent.zodiac.emoji} · mệnh ${meEl.name} (${me.parent.napAmName})`,
                      },
                      { label: 'Con giáp', value: me.relationCopy.label },
                    ],
                    text: `${me.relationCopy.text(me.parent.zodiac.ten, child.zodiac.ten)}\n\n${me.menh.text}`,
                  });
                }

                if (bo) {
                  const boEl = ELEMENTS[bo.parent.element];
                  sections.push({
                    heading: `Đối chiếu với bố (${bo.parent.canChi} ${bo.parent.year})`,
                    rows: [
                      {
                        label: 'Tuổi & mệnh bố',
                        value: `${bo.parent.zodiac.ten} ${bo.parent.zodiac.emoji} · mệnh ${boEl.name} (${bo.parent.napAmName})`,
                      },
                      { label: 'Con giáp', value: bo.relationCopy.label },
                    ],
                    text: `${bo.relationCopy.text(bo.parent.zodiac.ten, child.zodiac.ten)}\n\n${bo.menh.text}`,
                  });
                }

                sections.push({
                  heading: 'Lưu ý',
                  text: 'Đây là đối chiếu theo quan niệm Can Chi & ngũ hành để tham khảo — không phải lời phán. Em bé nào cũng là phúc của gia đình; nhóm "lưu ý" chỉ gợi ý bố mẹ thêm kiên nhẫn, tuyệt đối không có chuyện con "khắc" hay mang lỗi với cha mẹ. Tuổi tính theo năm âm lịch — bé sinh tháng 1–2 dương (trước Tết) thuộc năm âm liền trước.',
                });

                return {
                  title: 'Sinh con theo năm — hieu.asia',
                  subtitle: `Bé dự kiến sinh năm ${child.year} (${child.canChi})`,
                  hero: {
                    big: `${childEl.name} · ${child.zodiac.ten}`,
                    small: `${child.canChi} ${child.year} — mệnh ${child.napAmName}`,
                  },
                  sections,
                };
              }}
            />

            {/* Hạt giống đo nhu cầu "cẩm nang đón bé" — không backend, chỉ ghi ý định qua analytics. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:sinh-con"
                    capturedEvent="sinh_con_lead_captured"
                    capturedProps={{ year: child.year }}
                    blurb="Bản đầy đủ sẽ đối chiếu mệnh & con giáp của bé với cả nhà, gợi ý tên hợp mệnh và những mốc nên biết theo phong tục. Để email, chúng tôi gửi bạn khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Cần bản đối chiếu đầy đủ cho gia đình?
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ gộp: mệnh &amp; con giáp của bé với <strong>cả nhà</strong>, gợi
                      ý tên hợp mệnh, và những mốc nên biết theo phong tục. Vẫn là tham khảo — không
                      phán số mệnh.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('sinh_con_report_intent', {
                        year: child.year,
                        me_relation: me?.relation ?? null,
                        bo_relation: bo?.relation ?? null,
                      });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
