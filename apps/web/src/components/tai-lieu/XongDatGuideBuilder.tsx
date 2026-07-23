'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile } from '@/lib/sinh-con';
import {
  topCandidates,
  cautionChis,
  yearChiGroups,
  DEFAULT_TARGET_YEAR,
  TIER_META,
  type XongDatResult,
} from '@/lib/xong-dat';
import { useScrollToResult } from '@/lib/use-scroll-to-result';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import {
  HOW_TO_CHOOSE,
  DO_AND_DONT,
  XONG_DAT_DISCLAIMER,
  TET_2027_MUNG_1,
} from '@/lib/tai-lieu/xong-dat-guide';

/**
 * XongDatGuideBuilder — phần "cá nhân hoá" của tài liệu tặng tuổi xông đất.
 *
 * Khác với <XongDatChecker> ở /xong-dat (công cụ tra cứu, trả lời nhanh 1 câu
 * hỏi), khối này dựng TRỌN BỘ TÀI LIỆU cho một gia chủ: cách chọn, danh sách
 * tuổi hợp tính riêng, nhóm tuổi nên cân nhắc kèm lý do, và phần nói rõ đây là
 * tập tục tham khảo. Toàn bộ số liệu lấy từ engine `lib/xong-dat.ts` — không có
 * bảng tra viết tay, nhập cùng dữ liệu luôn ra cùng kết quả.
 */

const TARGET_YEAR = DEFAULT_TARGET_YEAR; // 2027 — Tết Đinh Mùi, mùng 1 = 06/02/2027

/** Các điểm cộng của một gợi ý, cho dòng tóm tắt. */
function plusLabels(r: XongDatResult): string {
  const labels = [r.chiNam, r.chiChu, r.menhChu].filter((a) => a.score > 0).map((a) => a.label);
  return labels.length ? labels.join(' · ') : 'Không phạm xung, hại';
}

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1900 && y <= 2100 ? y : null;
}

export function XongDatGuideBuilder() {
  const [hostYear, setHostYear] = React.useState('');

  const host = React.useMemo(() => {
    const y = parseYear(hostYear);
    return y ? yearProfile(y) : null;
  }, [hostYear]);

  const top = React.useMemo(() => {
    const y = parseYear(hostYear);
    return y ? topCandidates(y, TARGET_YEAR, 12) : [];
  }, [hostYear]);

  const caution = React.useMemo(() => {
    const y = parseYear(hostYear);
    return y ? cautionChis(y, TARGET_YEAR) : [];
  }, [hostYear]);

  const groups = React.useMemo(() => yearChiGroups(TARGET_YEAR), []);
  const { resultRef, armScroll } = useScrollToResult(host);

  const buildPayload = (): ToolPdfPayload | null => {
    if (!host || !groups || top.length === 0) return null;

    const sections: ToolPdfPayload['sections'] = [
      {
        heading: `Năm ${groups.target.canChi} ${TARGET_YEAR} — mùng 1 nhằm ngày ${TET_2027_MUNG_1}`,
        text:
          `Chi của năm: ${groups.target.zodiac.ten}. Mệnh nạp âm của năm: ${groups.target.napAmName}.\n` +
          `Nhóm tam hợp với chi năm: ${groups.tamHop.map((z) => z.ten).join(', ') || 'không có'}.\n` +
          `Lục hợp với chi năm: ${groups.lucHop.map((z) => z.ten).join(', ') || 'không có'}.\n` +
          `Xung với chi năm: ${groups.xung.map((z) => z.ten).join(', ') || 'không có'}.\n` +
          `Trùng chi năm (dân gian gọi là phạm Thái Tuế): ${groups.trung.map((z) => z.ten).join(', ') || 'không có'}.`,
      },
      ...HOW_TO_CHOOSE.map((s) => ({ heading: s.heading, text: s.body })),
      {
        heading: `Tuổi nên chọn — tính riêng cho gia chủ sinh ${host.year} (${host.canChi})`,
        rows: top.map((r) => ({
          label: `${r.guest.year} — ${r.guest.canChi}, tuổi ${r.guest.zodiac.ten} · ${TIER_META[r.tier].label}`,
          value: `Mệnh ${ELEMENTS[r.guest.element].name} (${r.guest.napAmName}) · ${plusLabels(r)}`,
        })),
      },
    ];

    if (caution.length > 0) {
      sections.push({
        heading: 'Nhóm tuổi nên cân nhắc (nêu rõ lý do)',
        rows: caution.map((c) => ({
          label: `Tuổi ${c.zodiac.ten}`,
          value: c.reasons.join('; '),
        })),
      });
    }

    for (const block of DO_AND_DONT) {
      sections.push({
        heading: block.heading,
        text: block.items.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
      });
    }

    sections.push({ heading: 'Giới hạn của tài liệu này', text: XONG_DAT_DISCLAIMER });

    return {
      title: 'Tuổi xông đất Tết Đinh Mùi 2027',
      subtitle: `Tài liệu tặng của hieu.asia — tính riêng cho gia chủ sinh năm ${host.year}`,
      hero: {
        big: `Gia chủ ${host.year} — ${host.canChi}, tuổi ${host.zodiac.ten}`,
        small: `Mệnh ${ELEMENTS[host.element].name} (${host.napAmName}) · Đón Tết ${groups.target.canChi}, mùng 1 ngày ${TET_2027_MUNG_1}`,
      },
      sections,
      cta: { text: 'Lập lá số miễn phí tại hieu.asia', url: 'https://hieu.asia/onboarding' },
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tính riêng cho nhà bạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-xs space-y-1">
          <Label htmlFor="tlHostYear">Năm sinh gia chủ (âm lịch)</Label>
          <Input
            id="tlHostYear"
            type="number"
            inputMode="numeric"
            placeholder="vd 1968"
            value={hostYear}
            onChange={(e) => {
              armScroll();
              setHostYear(e.target.value);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Gia chủ là người đứng tên nhà hoặc người lớn nhất trong nhà.
          </p>
        </div>

        {host && groups && (
          <div ref={resultRef} className="scroll-mt-24 space-y-4">
            <div className="rounded-lg border bg-card/40 p-4 text-sm text-muted-foreground">
              Gia chủ sinh năm{' '}
              <strong className="text-foreground">
                {host.year} — {host.canChi}, tuổi {host.zodiac.ten}
              </strong>
              , mệnh{' '}
              <strong className="text-gold">
                {ELEMENTS[host.element].name} — {host.napAmName}
              </strong>
              . Đón Tết <strong className="text-foreground">{groups.target.canChi}</strong>, mùng 1
              nhằm ngày {TET_2027_MUNG_1}.
            </div>

            {top.length > 0 && (
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Tuổi nên chọn ({top.length} phương án)
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {top.map((r) => (
                    <div key={r.guest.year} className="rounded-md border bg-card/30 p-3 text-sm">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {r.guest.year} — {r.guest.canChi}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {TIER_META[r.tier].label}
                        </span>
                      </div>
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        Mệnh {ELEMENTS[r.guest.element].name} ({r.guest.napAmName}) · {plusLabels(r)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caution.length > 0 && (
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Nhóm tuổi nên cân nhắc — và lý do
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  {caution.map((c) => (
                    <li key={c.zodiac.slug}>
                      <strong className="text-foreground">Tuổi {c.zodiac.ten}</strong>:{' '}
                      {c.reasons.join('; ')}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-gold/25 bg-gold/[0.04] p-4">
              <p className="text-sm font-medium text-foreground">
                Tải trọn tài liệu cho nhà bạn
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Bản PDF gồm: 5 bước chọn người xông đất, danh sách tuổi hợp ở trên, nhóm tuổi nên
                cân nhắc kèm lý do, ba việc nên làm và ba việc không cần làm. Để lại email, chúng
                tôi gửi thẳng vào hộp thư — không spam, huỷ bất cứ lúc nào.
              </p>
              <div className="mt-3">
                <DownloadToolPdfButton
                  source="pdf-tai-lieu-xong-dat"
                  label="Nhận bản PDF"
                  payload={buildPayload}
                />
              </div>
            </div>
          </div>
        )}

        {!host && hostYear.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Nhập năm sinh dạng 4 chữ số, trong khoảng 1900–2100.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
