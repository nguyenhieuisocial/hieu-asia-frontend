'use client';

import * as React from 'react';
import Link from 'next/link';

export interface ZodiacCardProps {
  zodiacKey: string;     // url slug, e.g. "ngo"
  zodiacName: string;    // "Ngọ"
  icon: string;          // emoji
  overallScore?: number; // 1-10
  summary?: string;
  loading?: boolean;
}

function scoreColor(score: number | undefined): string {
  if (score === undefined) return 'text-cream/60';
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-gold';
  if (score >= 4) return 'text-amber-400';
  return 'text-rose-400';
}

export function ZodiacCard({ zodiacKey, zodiacName, icon, overallScore, summary, loading }: ZodiacCardProps) {
  return (
    <Link
      href={`/tu-vi-hom-nay/${zodiacKey}`}
      className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-ink/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.5)]"
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl" aria-hidden>{icon}</div>
        <div className={`text-2xl font-bold ${scoreColor(overallScore)}`}>
          {loading ? '…' : overallScore !== undefined ? `${overallScore}/10` : '—'}
        </div>
      </div>
      <div className="mt-3 font-heading text-lg font-semibold text-cream">
        Tuổi {zodiacName}
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-cream/70">
        {loading ? 'Đang tải…' : summary ?? 'Bấm để xem chi tiết.'}
      </p>
      <div className="mt-3 text-xs text-gold/70 transition-colors group-hover:text-gold">
        Xem chi tiết →
      </div>
    </Link>
  );
}
