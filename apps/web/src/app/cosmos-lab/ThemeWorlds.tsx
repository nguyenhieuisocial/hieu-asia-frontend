'use client';

import * as React from 'react';

/**
 * ThemeWorlds — DEMO Nhóm 4: "dark mode = vũ trụ, light mode = giấy ấm".
 * Cùng MỘT nội dung hero, đổi giữa 2 thế giới mạch lạc bằng toggle.
 * Nền vũ trụ ở đây là CSS (nhẹ, tức thì) — chỉ để minh hoạ ý tưởng 2 tông.
 */

export function ThemeWorlds(): React.JSX.Element {
  const [dark, setDark] = React.useState(true);

  const paperBg = '#F3ECDD';
  const cosmosBg =
    'radial-gradient(1.5px 1.5px at 12% 28%, rgba(207,224,255,0.8), transparent), radial-gradient(1.5px 1.5px at 78% 18%, rgba(111,224,239,0.7), transparent), radial-gradient(1px 1px at 36% 62%, rgba(207,224,255,0.7), transparent), radial-gradient(1.5px 1.5px at 64% 74%, rgba(143,123,224,0.7), transparent), radial-gradient(1px 1px at 88% 52%, rgba(207,224,255,0.6), transparent), radial-gradient(1px 1px at 24% 84%, rgba(111,224,239,0.6), transparent), radial-gradient(ellipse 70% 55% at 50% 42%, rgba(43,31,90,0.5), rgba(4,6,13,0) 70%), #04060d';

  const ink = dark ? '#eaf1ff' : '#171411';
  const accent = dark ? '#6fe0ef' : '#A47532';
  const soft = dark ? 'rgba(234,241,255,0.72)' : '#6B6358';

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-mono uppercase" style={{ color: '#6B6358', fontSize: 12, letterSpacing: '0.24em' }}>
          Demo · Hai thế giới (light / dark)
        </p>
        {/* Toggle */}
        <div role="group" aria-label="Đổi thế giới" className="inline-flex rounded-full p-1" style={{ background: '#e7ddc9', border: '1px solid rgba(23,20,17,0.12)' }}>
          {([['☀️ Giấy', false], ['🌌 Vũ trụ', true]] as const).map(([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setDark(val)}
              aria-pressed={dark === val}
              className="rounded-full px-4 py-1.5 font-mono transition-all"
              style={{
                fontSize: 12,
                letterSpacing: '0.06em',
                background: dark === val ? (val ? '#04060d' : '#171411') : 'transparent',
                color: dark === val ? (val ? '#6fe0ef' : '#F3ECDD') : '#6B6358',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Khối hero đổi tông */}
      <div
        className="relative overflow-hidden rounded-[4px] px-8 py-14 transition-all duration-700 sm:px-12"
        style={{ background: dark ? cosmosBg : paperBg, border: dark ? '1px solid rgba(111,224,239,0.18)' : '1px solid rgba(23,20,17,0.1)' }}
      >
        <p className="font-mono uppercase transition-colors duration-700" style={{ color: accent, fontSize: 12, letterSpacing: '0.28em' }}>
          Cẩm nang quyết định bằng AI
        </p>
        <h3
          className="mt-4 font-light transition-colors duration-700"
          style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.05, color: ink }}
        >
          Hiểu mình.{' '}
          <span style={{ color: accent, fontStyle: dark ? 'normal' : 'italic' }}>Quyết định mình.</span>
        </h3>
        <p className="mt-4 max-w-md transition-colors duration-700" style={{ fontSize: 16, lineHeight: 1.6, color: soft }}>
          {dark
            ? 'Mỗi người sinh ra dưới một cấu trúc sao riêng — hieu.asia giải mã bằng AI.'
            : 'Tri thức cổ học Á Đông, được AI giải mã rõ ràng, để bạn tự chọn con đường.'}
        </p>
        <span
          className="mt-7 inline-block rounded-[2px] px-6 py-3 font-mono uppercase transition-all duration-700"
          style={{
            fontSize: 12,
            letterSpacing: '0.14em',
            background: dark ? 'transparent' : accent,
            color: dark ? accent : '#F3ECDD',
            border: dark ? `1px solid ${accent}` : '1px solid transparent',
          }}
        >
          Bắt đầu
        </span>
      </div>
      <p className="mt-3 text-center font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.2em', color: '#9a917e' }}>
        Cùng một nội dung · hai tông mạch lạc — người dùng chọn thế giới
      </p>
    </div>
  );
}
