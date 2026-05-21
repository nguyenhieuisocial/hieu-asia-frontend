/**
 * LogoApplicationBoard — 12 ngữ cảnh ứng dụng logo, mock bằng CSS.
 */

import * as React from 'react';
import { Card, CardContent } from '@hieu-asia/ui';
import { SymbolMark, Wordmark, Lockup } from './Logo';

interface MockProps {
  title: string;
  hint: string;
  children: React.ReactNode;
}

function Mock({ title, hint, children }: MockProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex h-56 items-center justify-center bg-ink/80 p-6">
        {children}
      </div>
      <CardContent className="border-t border-gold/10 pt-4">
        <div className="font-heading text-sm font-semibold text-cream">{title}</div>
        <div className="mt-1 text-[11px] text-cream/55">{hint}</div>
      </CardContent>
    </Card>
  );
}

export function LogoApplicationBoard() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Favicon */}
      <Mock title="1 · Favicon" hint="Tab trình duyệt — 32×32 px, symbol mark">
        <div className="flex w-full max-w-xs flex-col gap-2 rounded-lg border border-gold/15 bg-ink p-3">
          <div className="flex items-center gap-2 rounded-md bg-ink/80 px-2 py-2">
            <SymbolMark size={16} />
            <div className="text-[10px] text-cream/70">hieu.asia</div>
            <div className="ml-auto text-[10px] text-cream/30">×</div>
          </div>
          <div className="h-1 rounded bg-gold/20" />
          <div className="h-1 w-2/3 rounded bg-cream/10" />
        </div>
      </Mock>

      {/* 2. App icon */}
      <Mock title="2 · App icon" hint="iOS rounded-square 180×180 px">
        <div className="flex flex-col items-center gap-2">
          <SymbolMark size={96} />
          <div className="text-[10px] text-cream/60">hieu.asia</div>
        </div>
      </Mock>

      {/* 3. Business card */}
      <Mock title="3 · Business card" hint="Mặt trước · mặt sau · 85×55mm">
        <div className="flex gap-3">
          <div className="flex h-32 w-48 flex-col justify-between rounded-md border border-gold/30 bg-gradient-to-br from-ink to-purple-900 p-3 shadow-lg">
            <Wordmark size={20} />
            <div className="text-[9px] text-cream/60">
              <div className="text-cream">Trần Hiếu</div>
              <div>Founder · hieu.asia</div>
            </div>
          </div>
          <div className="flex h-32 w-48 items-center justify-center rounded-md border border-gold/30 bg-cream p-3 shadow-lg">
            <Wordmark variant="light" size={28} />
          </div>
        </div>
      </Mock>

      {/* 4. T-shirt */}
      <Mock title="4 · T-shirt" hint="Ngực trái · in chìm vàng đồng">
        <div className="relative h-44 w-36">
          <div className="absolute inset-x-3 top-3 h-10 rounded-b-3xl bg-cream/90" />
          <div className="absolute inset-2 top-8 rounded-md bg-gradient-to-br from-ink to-ink-night shadow-xl" />
          <div className="absolute left-7 top-14">
            <SymbolMark size={22} />
          </div>
          <div className="absolute -left-2 top-12 h-12 w-6 -rotate-12 rounded-bl-3xl bg-gradient-to-br from-ink to-ink-night" />
          <div className="absolute -right-2 top-12 h-12 w-6 rotate-12 rounded-br-3xl bg-gradient-to-br from-ink to-ink-night" />
        </div>
      </Mock>

      {/* 5. Website header */}
      <Mock title="5 · Website header" hint="Nav desktop — lockup trái">
        <div className="w-full max-w-md rounded-md border border-gold/15 bg-ink shadow-md">
          <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3">
            <Lockup size={20} />
            <div className="flex items-center gap-3 text-[10px] text-cream/70">
              <span>Tử Vi</span>
              <span>MBTI</span>
              <span>Bảng giá</span>
              <span className="rounded bg-gold px-2 py-0.5 text-ink">Đăng nhập</span>
            </div>
          </div>
          <div className="space-y-2 p-4">
            <div className="h-2 w-3/5 rounded bg-cream/15" />
            <div className="h-2 w-2/5 rounded bg-cream/10" />
          </div>
        </div>
      </Mock>

      {/* 6. Email signature */}
      <Mock title="6 · Email signature" hint="Plain HTML + symbol inline">
        <div className="w-full max-w-sm rounded border-l-2 border-gold bg-cream/95 p-4 font-sans">
          <div className="flex items-center gap-3">
            <SymbolMark size={36} />
            <div>
              <div className="text-sm font-semibold text-ink">Trần Hiếu</div>
              <div className="text-[11px] text-ink/60">Founder · hieu.asia</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-ink/70">
            hieu@hieu.asia · https://hieu.asia
          </div>
        </div>
      </Mock>

      {/* 7. Social profile */}
      <Mock title="7 · Social profile" hint="Avatar tròn 400×400 px">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gold-gradient blur-md opacity-50" />
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gold/40">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-purple-900">
              <SymbolMark size={68} />
            </div>
          </div>
        </div>
      </Mock>

      {/* 8. Presentation slide */}
      <Mock title="8 · Presentation slide" hint="Watermark góc — 16:9">
        <div className="relative h-32 w-56 overflow-hidden rounded-md border border-gold/15 bg-gradient-to-br from-ink to-purple-900 p-4 shadow-lg">
          <div className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
            Q4 · 2026
          </div>
          <div className="mt-1 font-heading text-sm font-semibold text-cream">
            Roadmap mở rộng
          </div>
          <div className="mt-2 h-1.5 w-1/2 rounded bg-cream/20" />
          <div className="absolute bottom-2 right-2 opacity-70">
            <Wordmark size={14} />
          </div>
        </div>
      </Mock>

      {/* 9. OG image */}
      <Mock title="9 · OG image" hint="1200×630 — share Facebook / X">
        <div className="relative flex h-32 w-56 flex-col justify-end overflow-hidden rounded-md border border-gold/30 p-3 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-purple-900 to-ink" />
          <div className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.25em] text-gold">
            Premium AI insight
          </div>
          <div className="relative">
            <div className="font-heading text-base font-bold leading-none text-cream">
              hieu<span className="text-gold">.asia</span>
            </div>
            <div className="mt-1 text-[9px] text-cream/80">
              Tử Vi · MBTI · Palm Reading bằng AI
            </div>
          </div>
        </div>
      </Mock>

      {/* 10. Loading screen */}
      <Mock title="10 · Loading screen" hint="Splash app — centered + spinner">
        <div className="flex h-44 w-36 flex-col items-center justify-center gap-4 rounded-2xl border border-gold/20 bg-gradient-to-b from-ink to-purple-900 shadow-xl">
          <SymbolMark size={56} />
          <div className="h-1 w-20 overflow-hidden rounded-full bg-cream/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gold" />
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-cream/70">
            đang tải…
          </div>
        </div>
      </Mock>

      {/* 11. Stamp / Seal */}
      <Mock title="11 · Con dấu vàng" hint="Tròn · vàng đồng · dùng cho cert / chữ ký">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gold/70 bg-gradient-to-br from-gold-900 to-purple-900 shadow-xl">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-gold/50">
              <SymbolMark size={36} />
              <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-gold">
                hieu.asia
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full opacity-20 bg-gold-gradient blur-sm" />
        </div>
      </Mock>

      {/* 12. Wall sign */}
      <Mock title="12 · Wall sign" hint="Văn phòng — kim loại brushed">
        <div className="relative h-32 w-56 overflow-hidden rounded-sm bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 p-2 shadow-2xl">
          <div className="absolute inset-2 flex items-center justify-center rounded-sm border border-stone-500/20 bg-gradient-to-b from-stone-100 to-stone-300">
            <Wordmark variant="light" size={28} />
          </div>
          <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-stone-600" />
          <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-stone-600" />
          <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-stone-600" />
          <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-stone-600" />
        </div>
      </Mock>
    </div>
  );
}
