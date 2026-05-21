/**
 * SpacingDemo — visual scale 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 px.
 */

import * as React from 'react';

const SCALE = [
  { token: 'space-1', px: 4, tw: '1', use: 'Khoảng cách icon-text trong inline' },
  { token: 'space-2', px: 8, tw: '2', use: 'Padding bên trong nút nhỏ' },
  { token: 'space-4', px: 16, tw: '4', use: 'Gap mặc định trong stack' },
  { token: 'space-6', px: 24, tw: '6', use: 'Padding card · gap giữa input form' },
  { token: 'space-8', px: 32, tw: '8', use: 'Gap section nhỏ trong page' },
  { token: 'space-12', px: 48, tw: '12', use: 'Gap section giữa khối lớn' },
  { token: 'space-16', px: 64, tw: '16', use: 'Padding hero · margin block lớn' },
  { token: 'space-24', px: 96, tw: '24', use: 'Spacing landmark — page section' },
];

export function SpacingDemo() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-cream/70">
        Spacing scale dùng đơn vị 4px (Tailwind default). Bám sát scale này để
        tránh khoảng cách "lẻ" gây mất nhịp thị giác.
      </p>
      <div className="space-y-3">
        {SCALE.map((s) => (
          <div
            key={s.token}
            className="grid grid-cols-[120px_minmax(110px,160px)_1fr] items-center gap-4 rounded-lg border border-gold/10 bg-ink/30 px-4 py-3"
          >
            <div className="font-mono text-xs text-gold">{s.token}</div>
            <div className="flex items-center gap-3">
              <div
                className="bg-gold-gradient rounded-sm"
                style={{ width: s.px, height: s.px }}
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-cream/70">{s.px}px</span>
            </div>
            <div className="text-sm text-cream/70">
              <code className="mr-2 rounded bg-gold/10 px-1.5 py-0.5 font-mono text-xs text-gold">
                p-{s.tw} / gap-{s.tw}
              </code>
              {s.use}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
