'use client';

import * as React from 'react';

interface TruData {
  label: string;
  can: string;
  chi: string;
  nguHanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
}

const SAMPLE_TRU: readonly TruData[] = [
  { label: 'Năm', can: 'Giáp', chi: 'Tý', nguHanh: 'Mộc' },
  { label: 'Tháng', can: 'Bính', chi: 'Dần', nguHanh: 'Hỏa' },
  { label: 'Ngày', can: 'Mậu', chi: 'Thìn', nguHanh: 'Thổ' },
  { label: 'Giờ', can: 'Canh', chi: 'Thân', nguHanh: 'Kim' },
];

const NGU_HANH_COLOR: Record<TruData['nguHanh'], string> = {
  Kim: '#D8CDB1',
  Mộc: '#5C8A6A',
  Thủy: '#3B5F8A',
  Hỏa: '#A84E2E',
  Thổ: '#B8923D',
};

// WCAG-AA readable text color for a solid hex background: keep the dark brand
// ink on light element colors (Kim/Mộc/Thổ) and switch to white on the dark
// ones (Hỏa/Thủy), picking whichever has the higher contrast ratio. This keeps
// every element chip legible instead of hardcoding one near-black ink that
// washes out on the darker fills.
function readableOn(hex: string): string {
  const channel = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(channel(1)) + 0.7152 * lin(channel(3)) + 0.0722 * lin(channel(5));
  const onInk = (L + 0.05) / (0.0048 + 0.05); // contrast vs near-black ink (#0F0F12)
  const onWhite = (1 + 0.05) / (L + 0.05); // contrast vs white
  return onWhite > onInk ? '#FFFFFF' : '#0F0F12';
}

export function InfographicBatTu() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse">
          <thead>
            <tr>
              <th className="border border-border bg-card/40 px-4 py-2 text-xs font-semibold text-muted-foreground">
                Trụ
              </th>
              {SAMPLE_TRU.map((t) => (
                <th
                  key={t.label}
                  className="border border-border bg-gold/10 px-4 py-2 text-sm font-semibold text-gold"
                >
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border bg-card/30 px-3 py-2 text-xs text-muted-foreground">
                Thiên Can
              </td>
              {SAMPLE_TRU.map((t) => (
                <td
                  key={`can-${t.label}`}
                  className="border border-border px-4 py-3 text-center font-heading text-lg text-foreground"
                >
                  {t.can}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-border bg-card/30 px-3 py-2 text-xs text-muted-foreground">
                Địa Chi
              </td>
              {SAMPLE_TRU.map((t) => (
                <td
                  key={`chi-${t.label}`}
                  className="border border-border px-4 py-3 text-center font-heading text-lg text-foreground"
                >
                  {t.chi}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-border bg-card/30 px-3 py-2 text-xs text-muted-foreground">
                Ngũ Hành
              </td>
              {SAMPLE_TRU.map((t) => (
                <td
                  key={`nh-${t.label}`}
                  className="border border-border px-3 py-2 text-center"
                >
                  <span
                    className="inline-block rounded px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: NGU_HANH_COLOR[t.nguHanh],
                      color: readableOn(NGU_HANH_COLOR[t.nguHanh]),
                    }}
                  >
                    {t.nguHanh}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Ví dụ: Một lá Bát Tự gồm 4 trụ (Năm/Tháng/Ngày/Giờ sinh), mỗi trụ có 1 Thiên Can + 1 Địa Chi.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {(Object.keys(NGU_HANH_COLOR) as TruData['nguHanh'][]).map((nh) => (
          <span
            key={nh}
            className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1"
          >
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: NGU_HANH_COLOR[nh] }}
            />
            <span className="text-muted-foreground">{nh}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
