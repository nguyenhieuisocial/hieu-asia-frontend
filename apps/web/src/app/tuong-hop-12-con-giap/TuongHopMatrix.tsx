'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';
import {
  ZODIAC,
  relationOf,
  nguHanhInteraction,
  findZodiac,
  pairToSlug,
  RELATION_COPY,
  type RelationKind,
} from '@/lib/hop-tuoi-pairs';

/**
 * TuongHopMatrix — công cụ tương tác "Chọn con giáp của bạn" (client 100%).
 *
 * Khách chọn 1 trong 12 con giáp → hiện quan hệ của con giáp đó với cả 11 con
 * còn lại: nhãn (Tam Hợp / Lục Hợp / Lục Xung / Lục Hại / bình hoà), tóm tắt
 * on-brand + tương tác Ngũ Hành, kèm link sang trang cặp chuyên sâu. Mọi thứ
 * tính từ các hàm THUẦN trong hop-tuoi-pairs (không gọi máy chủ, không bịa).
 *
 * Brand voice: phong tục để THAM KHẢO. "Xung"/"khắc" KHÔNG phải điềm xấu — chỉ
 * là hai nhịp khác nhau, cần dung hoà. Không phán, không bói.
 */

type BadgeTone = 'good' | 'warn' | 'neutral';

// Nhóm hợp → xanh; nhóm cần dung hoà → hổ phách; còn lại → trung tính.
const TONE_BY_RELATION: Record<RelationKind, BadgeTone> = {
  'tam-hop': 'good',
  'luc-hop': 'good',
  'luc-xung': 'warn',
  'luc-hai': 'warn',
  'dong-tuoi': 'neutral',
  'binh-hoa': 'neutral',
};

const BADGE_CLASS: Record<BadgeTone, string> = {
  good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  neutral: 'border-border bg-card/40 text-foreground/70',
};

function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

function isValidSlug(slug: string | undefined): slug is string {
  return !!slug && !!findZodiac(slug);
}

export function TuongHopMatrix({ initialSlug }: { initialSlug?: string } = {}): React.JSX.Element {
  // Prefill từ ?tuoi= (link nội bộ): nếu slug hợp lệ → mở sẵn kết quả. Compute
  // deterministic (không dùng Date) nên không lệch hydrate. KHÔNG bắn track khi
  // prefill — chỉ tính là "người dùng chọn" khi họ thật sự bấm.
  const [pick, setPick] = React.useState<string | undefined>(
    isValidSlug(initialSlug) ? initialSlug : undefined,
  );
  const firedRef = React.useRef(false);

  const onPick = React.useCallback((slug: string) => {
    setPick(slug);
    if (!firedRef.current) {
      firedRef.current = true;
      track('tool_used', { tool: 'tuong-hop-12-con-giap', result: 'ok' });
    }
  }, []);

  const picked = pick ? findZodiac(pick) : undefined;
  const others = picked ? ZODIAC.filter((z) => z.slug !== picked.slug) : [];

  return (
    <div>
      {/* Bộ chọn — 12 nút emoji, mobile-first */}
      <div className="rounded-2xl border border-gold/25 bg-card/60 p-4 backdrop-blur-sm sm:p-5">
        <p className="mb-3 font-mono text-[13px] uppercase tracking-[0.12em] text-muted-foreground">
          Chọn con giáp của bạn
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {ZODIAC.map((z) => {
            const active = z.slug === pick;
            return (
              <button
                key={z.slug}
                type="button"
                onClick={() => onPick(z.slug)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-sm transition ${
                  active
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-background/40 text-foreground/85 hover:border-gold/40 hover:text-gold'
                }`}
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {z.emoji}
                </span>
                <span className="font-medium">{z.ten}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kết quả — quan hệ của con giáp đã chọn với 11 con còn lại */}
      <div className="mt-6 scroll-mt-24">
        {!picked ? (
          <p className="rounded-xl border border-dashed border-border bg-card/30 p-5 text-center text-sm leading-relaxed text-muted-foreground">
            Bấm một con giáp phía trên để xem con giáp đó hợp / khắc thế nào với cả 11 con còn lại —
            tam hợp, lục hợp, lục xung, lục hại và tương sinh – tương khắc Ngũ Hành.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Con giáp đang chọn */}
            <div className="rounded-xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none" aria-hidden>
                  {picked.emoji}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Tuổi {picked.ten}
                  </h3>
                  <p className="text-xs text-muted-foreground">Ngũ hành: {picked.nguHanh}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{picked.blurb}</p>
            </div>

            {/* Danh sách 11 con còn lại */}
            <ul className="space-y-3">
              {others.map((z) => {
                const rel = relationOf(picked.slug, z.slug);
                const copy = RELATION_COPY[rel];
                const nh = nguHanhInteraction(picked, z);
                return (
                  <li
                    key={z.slug}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                        <span className="text-2xl leading-none" aria-hidden>
                          {z.emoji}
                        </span>
                        Tuổi {z.ten}
                      </span>
                      <Badge tone={TONE_BY_RELATION[rel]}>{copy.label}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                      {copy.summary(picked.ten, z.ten)}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{nh.text}</p>
                    <Link
                      href={`/hop-tuoi/tuoi/${pairToSlug(picked.slug, z.slug)}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
                    >
                      Xem chi tiết cặp {picked.ten} – {z.ten}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là tri thức phong tục Can Chi để <strong className="text-foreground/90">tham khảo</strong>.
              &quot;Xung&quot;/&quot;hại&quot; không phải điềm xấu — chỉ là hai nhịp sống khác nhau, cần
              dung hoà. Sự hợp nhau thật sự nằm ở cách hai người lắng nghe nhau, không chỉ ở con giáp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
