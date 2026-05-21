'use client';

/**
 * Interactive color palette. Click swatch → copy hex to clipboard.
 */

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

interface Swatch {
  name: string;
  hex: string;
  fg?: 'dark' | 'light';
  note?: string;
}

interface SwatchGroup {
  title: string;
  description?: string;
  swatches: Swatch[];
}

const GROUPS: SwatchGroup[] = [
  {
    title: 'Neutrals',
    description: 'Nền và chữ chính',
    swatches: [
      { name: 'Ink', hex: '#0F0F12', fg: 'light', note: 'Đen than · nền chính' },
      { name: 'Ink Night', hex: '#0B1326', fg: 'light', note: 'Xanh đêm · nền alt' },
      { name: 'Cream', hex: '#F2EDE3', fg: 'dark', note: 'Kem ngà · text trên nền tối' },
    ],
  },
  {
    title: 'Gold scale (primary)',
    description: 'Vàng đồng — CTA, highlight, accent',
    swatches: [
      { name: 'gold/50', hex: '#FBF6EC', fg: 'dark' },
      { name: 'gold/100', hex: '#F4E6C4', fg: 'dark' },
      { name: 'gold/200', hex: '#E6CC8C', fg: 'dark' },
      { name: 'gold/300', hex: '#D5B057', fg: 'dark' },
      { name: 'gold/400', hex: '#C49E46', fg: 'dark' },
      { name: 'gold/500', hex: '#B8923D', fg: 'dark', note: 'DEFAULT' },
      { name: 'gold/600', hex: '#917231', fg: 'light' },
      { name: 'gold/700', hex: '#6B5424', fg: 'light' },
      { name: 'gold/800', hex: '#453616', fg: 'light' },
      { name: 'gold/900', hex: '#1F1808', fg: 'light' },
    ],
  },
  {
    title: 'Purple (mystic)',
    description: 'Tím trầm — chiều sâu huyền học',
    swatches: [
      { name: 'purple/50', hex: '#EFEAF5', fg: 'dark' },
      { name: 'purple/500', hex: '#3B2754', fg: 'light', note: 'DEFAULT' },
      { name: 'purple/700', hex: '#281A3A', fg: 'light' },
      { name: 'purple/900', hex: '#160E20', fg: 'light' },
    ],
  },
  {
    title: 'Jade (calm/trust)',
    description: 'Xanh ngọc — yên tâm, tin cậy',
    swatches: [
      { name: 'jade/50', hex: '#E6F0EE', fg: 'dark' },
      { name: 'jade/500', hex: '#2D5F5A', fg: 'light', note: 'DEFAULT' },
      { name: 'jade/700', hex: '#1F423F', fg: 'light' },
      { name: 'jade/900', hex: '#0F2120', fg: 'light' },
    ],
  },
  {
    title: 'Semantic',
    description: 'Trạng thái — thành công / cảnh báo / lỗi / thông tin',
    swatches: [
      { name: 'success', hex: '#15803D', fg: 'light' },
      { name: 'warning', hex: '#CA8A04', fg: 'dark' },
      { name: 'error', hex: '#B91C1C', fg: 'light' },
      { name: 'info', hex: '#1D4ED8', fg: 'light' },
    ],
  },
];

const GRADIENTS = [
  {
    name: 'gold-gradient',
    css: 'linear-gradient(135deg, #B8923D 0%, #D5B057 50%, #B8923D 100%)',
    note: 'CTA chính, lockup wordmark',
  },
  {
    name: 'ink-radial',
    css: 'radial-gradient(ellipse at top, #1a1a22 0%, #0F0F12 60%)',
    note: 'Background hero',
  },
  {
    name: 'mystic-ink',
    css: 'linear-gradient(135deg, #0F0F12 0%, #1A0E2E 100%)',
    note: 'Symbol mark BG',
  },
];

export function ColorPalette() {
  return (
    <div className="space-y-10">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="font-heading text-lg font-semibold text-cream">{group.title}</h3>
          {group.description ? (
            <p className="mt-1 text-sm text-cream/60">{group.description}</p>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {group.swatches.map((sw) => (
              <SwatchTile key={sw.hex + sw.name} {...sw} />
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3 className="font-heading text-lg font-semibold text-cream">Gradients</h3>
        <p className="mt-1 text-sm text-cream/60">Tổ hợp gradient signature của brand</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {GRADIENTS.map((g) => (
            <GradientTile key={g.name} {...g} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SwatchTile({ name, hex, fg = 'light', note }: Swatch) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }, [hex]);

  return (
    <button
      type="button"
      onClick={copy}
      className="group relative flex h-28 flex-col justify-between rounded-lg border border-gold/15 p-3 text-left transition hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      style={{ backgroundColor: hex }}
      aria-label={`Copy ${hex}`}
    >
      <span
        className={`text-xs font-medium ${fg === 'dark' ? 'text-ink' : 'text-cream'}`}
      >
        {name}
      </span>
      <span className="flex items-center justify-between">
        <span
          className={`font-mono text-[11px] ${fg === 'dark' ? 'text-ink/80' : 'text-cream/80'}`}
        >
          {hex.toUpperCase()}
        </span>
        {copied ? (
          <Check className={`h-3.5 w-3.5 ${fg === 'dark' ? 'text-ink' : 'text-cream'}`} />
        ) : (
          <Copy
            className={`h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 ${fg === 'dark' ? 'text-ink' : 'text-cream'}`}
          />
        )}
      </span>
      {note ? (
        <span
          className={`absolute bottom-1 left-3 right-3 text-[10px] ${fg === 'dark' ? 'text-ink/60' : 'text-cream/60'}`}
        >
          {note}
        </span>
      ) : null}
    </button>
  );
}

function GradientTile({ name, css, note }: { name: string; css: string; note: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* */
    }
  }, [css]);

  return (
    <button
      type="button"
      onClick={copy}
      className="group relative flex h-32 flex-col justify-between overflow-hidden rounded-lg border border-gold/15 p-3 text-left transition hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      style={{ background: css }}
      aria-label={`Copy ${name}`}
    >
      <span className="text-xs font-medium text-cream drop-shadow-sm">{name}</span>
      <span className="text-[10px] text-cream/80 drop-shadow-sm">{note}</span>
      <span className="absolute right-2 top-2">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-cream" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-cream opacity-0 transition group-hover:opacity-100" />
        )}
      </span>
    </button>
  );
}
