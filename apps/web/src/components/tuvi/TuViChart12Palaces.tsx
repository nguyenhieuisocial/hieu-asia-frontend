'use client';

/**
 * Interactive 12-palace Tử Vi chart.
 *
 * Layout — traditional Bắc phái grid:
 *   12 palaces around a center square (chart meta).
 *   Mobile: 4×4 grid that wraps; meta sits at top.
 *   Desktop: classic 4×4 grid with the inner 2×2 left for meta.
 *
 * Interactions:
 *   - Click a palace → highlight it + its tam phương tứ chính.
 *   - Selected palace's detail card renders below the grid (mobile) or to the
 *     side (desktop).
 *   - Hover shows brightness/mutagen of stars.
 *
 * Data shape: see lib/tuvi-client.ts.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { Sparkles, ShieldAlert, Info } from 'lucide-react';
import type { TuViChart, TuViPalace } from '@/lib/tuvi-client';
import { tamPhuongTuChinh } from '@/lib/tuvi-client';

interface PalaceCellProps {
  palace: TuViPalace;
  selected: boolean;
  trigon: boolean;
  onClick: () => void;
}

function StarPill({ star }: { star: { name: string; brightness?: string; mutagen?: string } }) {
  const isLucky = star.mutagen === 'Lộc' || star.mutagen === 'Quyền' || star.mutagen === 'Khoa';
  const isUnlucky = star.mutagen === 'Kỵ';
  return (
    <span
      title={star.brightness ? `${star.name} (${star.brightness})` : star.name}
      className={cn(
        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px]',
        isLucky && 'bg-jade/15 text-jade-50',
        isUnlucky && 'bg-red-500/15 text-red-300',
        !isLucky && !isUnlucky && 'bg-cream/5 text-cream/80',
      )}
    >
      {star.name}
      {star.mutagen && (
        <span className="rounded bg-gold/20 px-1 text-[9px] text-gold">{star.mutagen[0]}</span>
      )}
    </span>
  );
}

function PalaceCell({ palace, selected, trigon, onClick }: PalaceCellProps) {
  const allMajor = palace.majorStars.slice(0, 3);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Cung ${palace.name}`}
      className={cn(
        'flex h-full min-h-[110px] flex-col items-start gap-1 rounded-lg border bg-ink/40 p-2 text-left transition-colors',
        'hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        selected && 'border-gold bg-gold/10 shadow-[0_0_20px_-8px_rgba(184,146,61,0.6)]',
        !selected && trigon && 'border-gold/40 bg-gold/[0.04]',
        !selected && !trigon && 'border-cream/10',
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-gold/80">
          {palace.heavenlyStem} {palace.earthlyBranch}
        </span>
        {palace.isBodyPalace && (
          <span
            title="Cung Thân"
            className="rounded bg-purple/30 px-1 font-mono text-[9px] text-cream/85"
          >
            Thân
          </span>
        )}
      </div>
      <h3 className="font-heading text-sm font-semibold text-cream">{palace.name}</h3>
      {allMajor.length > 0 && (
        <div className="mt-0.5 flex flex-wrap gap-1">
          {allMajor.map((s) => (
            <StarPill key={s.name} star={s} />
          ))}
        </div>
      )}
      {palace.decadal?.range && (
        <p className="mt-auto font-mono text-[9px] text-cream/70">
          ĐV {palace.decadal.range[0]}–{palace.decadal.range[1]}
        </p>
      )}
    </button>
  );
}

function PalaceDetail({ palace }: { palace: TuViPalace }) {
  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">
            {palace.heavenlyStem} {palace.earthlyBranch}
          </p>
          <h3 className="mt-1 font-heading text-2xl font-bold text-cream">Cung {palace.name}</h3>
          {palace.isBodyPalace && (
            <p className="mt-1 text-xs text-purple-200">
              Đây cũng là Cung Thân — phần thể hiện hành động cụ thể trong đời.
            </p>
          )}
        </div>
        {palace.decadal?.range && (
          <div className="rounded-md border border-gold/30 px-3 py-1.5 text-xs text-gold/90">
            Đại vận {palace.decadal.range[0]}–{palace.decadal.range[1]} tuổi
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {palace.majorStars.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold/70">
              Chính tinh
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {palace.majorStars.map((s) => (
                <StarPill key={s.name} star={s} />
              ))}
            </div>
          </div>
        )}
        {palace.minorStars.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">
              Phụ tinh
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {palace.minorStars.map((s) => (
                <StarPill key={s.name} star={s} />
              ))}
            </div>
          </div>
        )}
        {palace.adjectiveStars.length > 0 && (
          <div className="sm:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
              Sao bổ trợ ({palace.adjectiveStars.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {palace.adjectiveStars.slice(0, 12).map((s) => (
                <StarPill key={s.name} star={s} />
              ))}
              {palace.adjectiveStars.length > 12 && (
                <span className="text-[10px] text-cream/70">
                  +{palace.adjectiveStars.length - 12} sao khác
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-md border border-cream/10 bg-ink/40 p-3 text-xs leading-relaxed text-cream/75">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" aria-hidden />
          <p>
            <span className="font-semibold text-cream">Tam phương tứ chính:</span> các cung
            được tô vàng nhạt trên sơ đồ là bộ liên kết với cung {palace.name}. Đây là
            nhóm cung chính dùng để luận sâu — cùng đọc bộ này mới ra kết luận có chiều
            sâu, không chỉ đọc một cung riêng lẻ.
          </p>
        </div>
      </div>
    </div>
  );
}

export interface TuViChart12PalacesProps {
  chart: TuViChart;
  initialPalaceIndex?: number;
  /** Optional callback when palace is selected (for analytics or external sync). */
  onSelectPalace?: (palace: TuViPalace) => void;
}

export function TuViChart12Palaces({
  chart,
  initialPalaceIndex = 0,
  onSelectPalace,
}: TuViChart12PalacesProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(initialPalaceIndex);

  const selectedPalace =
    chart.palaces.find((p) => p.index === selectedIndex) ?? chart.palaces[0];
  const trigonSet = React.useMemo(
    () => new Set(tamPhuongTuChinh(selectedIndex)),
    [selectedIndex],
  );

  const handleSelect = (palace: TuViPalace) => {
    setSelectedIndex(palace.index);
    onSelectPalace?.(palace);
  };

  if (!selectedPalace) return null;

  return (
    <div className="space-y-6">
      {/* Chart meta strip */}
      <div className="rounded-xl border border-gold/20 bg-ink/40 p-4">
        <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Ngày dương" value={chart.meta.solarDate} />
          <Stat label="Can Chi" value={chart.meta.chineseDate.split(' - ')[0] ?? '—'} />
          <Stat label="Cục" value={chart.meta.fiveElementsClass} />
          <Stat label="Mệnh — Thân" value={`${chart.meta.soul} — ${chart.meta.body}`} />
        </div>
      </div>

      {/* 4×4 grid: 12 palaces around + meta center */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {chart.palaces
          .slice() // copy
          .sort((a, b) => a.index - b.index)
          .map((p) => (
            <PalaceCell
              key={p.index}
              palace={p}
              selected={p.index === selectedIndex}
              trigon={trigonSet.has(p.index) && p.index !== selectedIndex}
              onClick={() => handleSelect(p)}
            />
          ))}
      </div>

      {/* Detail card for selected palace */}
      <PalaceDetail palace={selectedPalace} />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-cream/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-gold" /> Cung đang chọn
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm border border-gold/40 bg-gold/[0.06]" /> Tam phương
          tứ chính
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-gold/80" aria-hidden /> Chính tinh có tứ hoá
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-3 w-3 text-red-400" aria-hidden /> Hoá Kỵ — cần chú ý
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">{label}</p>
      <p className="mt-1 font-heading text-sm font-semibold text-cream sm:text-base">{value}</p>
    </div>
  );
}
