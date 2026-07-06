'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { ChevronDown, ChevronUp, ShieldCheck, Info } from 'lucide-react';
import type { BaziChart } from '@/lib/bazi';

/**
 * "Vì sao đúng?" — the belief moment on the instant Bát Tự chart.
 *
 * A transparent, scannable disclosure that, for each key conclusion the visitor
 * just saw, shows the DETERMINISTIC basis pulled from the real `BaziChart`
 * (never invented). This transparency is the product's TRUST moat vs fake-AI
 * competitors: con số tính từ lịch — kiểm chứng được; phần luận giải mô tả
 * khuynh hướng, KHÔNG phán số phận.
 *
 * Visual pattern mirrors `components/report/ExplainPanel.tsx` (grid-rows
 * collapse, gold/cream border, Info footer) but is a focused, separate
 * component so it never touches the paid-report panel's shape/usage.
 */

interface ProofRow {
  /** What the visitor saw (the conclusion). */
  claim: string;
  /** The deterministic rule that produced it (one short sentence). */
  basis: string;
  /** Real computed values from the chart that prove it (e.g. "Giáp · Dần"). */
  evidence: string;
  /** Optional classical source cited by the engine for this lookup. */
  source?: string;
}

function buildRows(chart: BaziChart): ProofRow[] {
  const rows: ProofRow[] = [];

  // 1. Four pillars ← tiết khí → can chi (not guessed).
  rows.push({
    claim: 'Tứ Trụ (8 chữ) lập từ ngày sinh dương lịch',
    basis:
      'Trụ năm đổi tại Lập Xuân, trụ tháng theo 12 tiết khí (vị trí Mặt Trời mỗi 30°) — không theo lịch âm thường. Trụ ngày là chu kỳ 60 ngày liên tục; trụ giờ suy từ can ngày (Ngũ Thử Độn).',
    evidence: `${chart.year.can} ${chart.year.chi} · ${chart.month.can} ${chart.month.chi} · ${chart.day.can} ${chart.day.chi} · ${chart.hour.can} ${chart.hour.chi}`,
    source: 'thuật toán Mặt Trời Meeus (sai số < 0.01°)',
  });

  // 2. Nhật Chủ + ngũ hành đọc thẳng off the pillars (table mapping).
  rows.push({
    claim: `Nhật Chủ ${chart.dayMaster.can} (${chart.dayMaster.element} ${chart.dayMaster.yang ? 'dương' : 'âm'})`,
    basis:
      'Nhật Chủ = can của trụ ngày. Ngũ hành mỗi can/chi tra theo bảng cố định, rồi đếm trên 8 chữ — không phải lời đoán.',
    evidence: `Mộc ${chart.elementCount['Mộc']} · Hỏa ${chart.elementCount['Hỏa']} · Thổ ${chart.elementCount['Thổ']} · Kim ${chart.elementCount['Kim']} · Thủy ${chart.elementCount['Thủy']} → mạnh nhất ${chart.strongest}${
      chart.missing.length ? `, thiếu ${chart.missing.join('/')}` : ', đủ cả 5'
    }`,
  });

  // 3. Đại vận direction + start ← yang/yin year + gender rule.
  if (chart.daiVan) {
    const yearYang = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(chart.year.can);
    rows.push({
      claim: `Đại vận đi chiều ${chart.daiVan.forward ? 'thuận' : 'nghịch'}, khởi ~${chart.daiVan.startAge} tuổi`,
      basis:
        'Chiều theo luật âm-dương can năm + giới tính (dương-nam / âm-nữ → thuận). Tuổi khởi vận = số ngày từ lúc sinh tới tiết khí kế chia 3 — tính từ lịch, không ước chừng.',
      evidence: `can năm ${chart.year.can} (${yearYang ? 'dương' : 'âm'}) + giới tính → ${chart.daiVan.forward ? 'thuận' : 'nghịch'}`,
    });
  }

  // 4. Trường Sinh ← classical 12-stage table look-up.
  rows.push({
    claim: `Vòng Trường Sinh của ${chart.dayMaster.can} trên 4 chi`,
    basis:
      'Trạng thái "đời người" của Nhật Chủ trên mỗi địa chi — tra theo bảng 12 giai đoạn cố định (Trường Sinh → Đế Vượng = mạnh; Suy → Tuyệt = yếu). Can dương đi thuận, can âm đi nghịch.',
    evidence: `${chart.year.label} ${chart.year.truongSinh} · ${chart.month.label} ${chart.month.truongSinh} · ${chart.day.label} ${chart.day.truongSinh} · ${chart.hour.label} ${chart.hour.truongSinh}`,
    source: 'Uyên Hải Tử Bình',
  });

  // 5. Thần Sát ← classical table look-up (only if any present).
  if (chart.thanSat.length > 0) {
    rows.push({
      claim: `Thần Sát: ${chart.thanSat.map((t) => t.name).join(', ')}`,
      basis:
        'Sao tượng trưng tra theo tam-hợp chi năm/ngày & can ngày — bảng cố định, không phải điềm tốt/xấu. Mỗi sao là một "màu" tính cách để hiểu mình.',
      evidence: chart.thanSat.map((t) => `${t.name} (${t.chi})`).join(' · '),
      source: 'Tam Mệnh Thông Hội',
    });
  }

  return rows;
}

export function ProofDisclosure({ chart }: { chart: BaziChart }) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const rows = React.useMemo(() => buildRows(chart), [chart]);

  return (
    <div className="rounded-xl border border-gold/30 bg-gold/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors',
          'hover:bg-gold/[0.06]',
        )}
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-heading text-sm font-semibold text-foreground">
            Vì sao lá số này đúng?
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Xem từng kết luận được tính ra sao — minh bạch, kiểm chứng được.
          </span>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="space-y-2.5 px-4 pb-4 pt-1">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card/40 p-3"
              >
                <p className="flex items-baseline gap-2 text-sm font-medium text-foreground">
                  <span className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true">
                    ✓
                  </span>
                  <span>{row.claim}</span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:pl-5">
                  {row.basis}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:pl-5">
                  <span className="rounded bg-border/50 px-2 py-0.5 font-mono text-[13px] text-foreground/80">
                    {row.evidence}
                  </span>
                  {row.source && (
                    <span className="text-[13px] italic text-muted-foreground">
                      tra theo {row.source}
                    </span>
                  )}
                </div>
              </div>
            ))}

            <p className="flex items-start gap-2 rounded-lg border border-gold/20 bg-gold/[0.05] p-3 text-[13px] leading-relaxed text-foreground/80">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />
              <span>
                <strong>Con số tính từ lịch — kiểm chứng được.</strong> Toàn bộ ở trên là dữ kiện
                tra theo bảng &amp; vị trí Mặt Trời, không bói toán. Phần luận giải (bản đọc đầy
                đủ) mô tả <em>khuynh hướng</em> để bạn tự hiểu mình — <strong>KHÔNG phán số phận</strong>.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
