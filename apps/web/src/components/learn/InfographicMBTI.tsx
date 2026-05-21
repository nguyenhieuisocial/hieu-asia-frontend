'use client';

import * as React from 'react';

type Quadrant = 'NT' | 'NF' | 'SJ' | 'SP';

interface MbtiType {
  code: string;
  nickname: string;
  desc: string;
  quadrant: Quadrant;
}

const MBTI_TYPES: readonly MbtiType[] = [
  { code: 'INTJ', nickname: 'Nhà chiến lược', desc: 'Tư duy hệ thống, độc lập', quadrant: 'NT' },
  { code: 'INTP', nickname: 'Nhà tư duy', desc: 'Logic, tò mò vô hạn', quadrant: 'NT' },
  { code: 'ENTJ', nickname: 'Nhà chỉ huy', desc: 'Quyết đoán, dẫn dắt', quadrant: 'NT' },
  { code: 'ENTP', nickname: 'Người tranh luận', desc: 'Sáng tạo, phản biện sắc', quadrant: 'NT' },
  { code: 'INFJ', nickname: 'Người che chở', desc: 'Trực giác sâu, lý tưởng', quadrant: 'NF' },
  { code: 'INFP', nickname: 'Người hòa giải', desc: 'Cảm xúc, chân thật', quadrant: 'NF' },
  { code: 'ENFJ', nickname: 'Nhà ngoại giao', desc: 'Truyền cảm hứng, ấm áp', quadrant: 'NF' },
  { code: 'ENFP', nickname: 'Nhà vận động', desc: 'Nhiệt huyết, sáng tạo', quadrant: 'NF' },
  { code: 'ISTJ', nickname: 'Nhà hậu cần', desc: 'Trật tự, đáng tin', quadrant: 'SJ' },
  { code: 'ISFJ', nickname: 'Người bảo vệ', desc: 'Tận tụy, chu đáo', quadrant: 'SJ' },
  { code: 'ESTJ', nickname: 'Nhà điều hành', desc: 'Tổ chức, kỷ luật', quadrant: 'SJ' },
  { code: 'ESFJ', nickname: 'Người chăm sóc', desc: 'Hòa đồng, có trách nhiệm', quadrant: 'SJ' },
  { code: 'ISTP', nickname: 'Nhà kỹ thuật', desc: 'Thực tế, linh hoạt', quadrant: 'SP' },
  { code: 'ISFP', nickname: 'Nghệ sĩ', desc: 'Tinh tế, tự do', quadrant: 'SP' },
  { code: 'ESTP', nickname: 'Người mạo hiểm', desc: 'Năng động, thực dụng', quadrant: 'SP' },
  { code: 'ESFP', nickname: 'Người biểu diễn', desc: 'Vui vẻ, hấp dẫn', quadrant: 'SP' },
];

const QUADRANT_STYLE: Record<Quadrant, { bg: string; text: string; label: string }> = {
  NT: { bg: 'bg-[#5C3D8A]/20', text: 'text-[#A98AD3]', label: 'Analysts' },
  NF: { bg: 'bg-[#3D8A6E]/20', text: 'text-[#7BC9A8]', label: 'Diplomats' },
  SJ: { bg: 'bg-[#B8923D]/20', text: 'text-[#D8B566]', label: 'Sentinels' },
  SP: { bg: 'bg-[#F5EFE0]/15', text: 'text-[#F5EFE0]', label: 'Explorers' },
};

export function InfographicMBTI() {
  const [active, setActive] = React.useState<string | null>(null);
  const activeType = active ? MBTI_TYPES.find((t) => t.code === active) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MBTI_TYPES.map((t) => {
          const style = QUADRANT_STYLE[t.quadrant];
          const isActive = active === t.code;
          return (
            <button
              key={t.code}
              type="button"
              onClick={() => setActive(isActive ? null : t.code)}
              className={`rounded-lg border p-3 text-left transition-all ${style.bg} ${
                isActive ? 'border-gold ring-2 ring-gold/40' : 'border-cream/15 hover:border-cream/40'
              }`}
            >
              <div className={`font-heading text-base font-bold ${style.text}`}>{t.code}</div>
              <div className="text-[11px] text-cream/70">{t.nickname}</div>
            </button>
          );
        })}
      </div>

      {activeType && (
        <div className="rounded-lg border border-gold/40 bg-ink/40 p-4">
          <div className="flex items-baseline gap-3">
            <span className={`font-heading text-xl font-bold ${QUADRANT_STYLE[activeType.quadrant].text}`}>
              {activeType.code}
            </span>
            <span className="text-sm text-cream/80">{activeType.nickname}</span>
            <span className="ml-auto text-xs text-cream/70">
              {QUADRANT_STYLE[activeType.quadrant].label}
            </span>
          </div>
          <p className="mt-2 text-sm text-cream/70">{activeType.desc}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {(Object.keys(QUADRANT_STYLE) as Quadrant[]).map((q) => (
          <span
            key={q}
            className={`inline-flex items-center gap-1.5 rounded border border-cream/15 px-2 py-1 ${QUADRANT_STYLE[q].bg}`}
          >
            <span className={QUADRANT_STYLE[q].text}>{QUADRANT_STYLE[q].label}</span>
            <span className="text-cream/70">({q})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
