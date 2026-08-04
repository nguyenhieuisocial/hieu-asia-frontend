import * as React from 'react';
// Diễn giải Bát Tự đời thường (data tĩnh nhỏ, dùng chung — engine vẫn lazy-import).
import { CAN_PLAIN, TEN_GOD_PLAIN, NGU_HANH_PLAIN } from '@/lib/bat-tu-plain';
import type { Reveal } from './types';
import { DongLensCard, TayLensCard } from './LensCards';

export function BaziRevealPanel({
  reveal,
  revealRef,
  onReset,
}: {
  reveal: Reveal;
  revealRef: React.RefObject<HTMLDivElement | null>;
  onReset: () => void;
}): React.JSX.Element {
  return (
    <div className="ob-detail-wrap">
      <div
        ref={revealRef}
        tabIndex={-1}
        className="ob-reveal"
        role="region"
        aria-label="Lát cắt về bạn"
      >
        <div className="ob-reveal-head">
          <span className="ob-reveal-emoji" aria-hidden="true">
            {reveal.dong.zodiac.emoji}
          </span>
          <span className="ob-reveal-heading">
            <span className="ob-reveal-title">Lát cắt về bạn</span>
            <span className="ob-reveal-menh">Nhiều lăng kính — một bức tranh</span>
          </span>
          <button
            type="button"
            className="ob-detail-close"
            onClick={onReset}
            aria-label="Thử ngày khác"
          >
            ×
          </button>
        </div>

        <DongLensCard reveal={reveal} />

        <TayLensCard reveal={reveal} />

        <div className="ob-lens">
          <span className="ob-lens-tag">Bát Tự — Tứ Trụ</span>
          <p className="ob-lens-line">
            <strong>
              "Chất gốc" của bạn: {reveal.bazi.dayCan} — hình tượng{' '}
              {CAN_PLAIN[reveal.bazi.dayCan]?.hinh ?? reveal.bazi.dayEl}
            </strong>
          </p>
          {CAN_PLAIN[reveal.bazi.dayCan] && (
            <p className="ob-lens-sub">{CAN_PLAIN[reveal.bazi.dayCan]!.blurb}</p>
          )}
          {TEN_GOD_PLAIN[reveal.bazi.monthTenGod] && (
            <p className="ob-lens-sub">
              Nền công việc & trưởng thành (trụ tháng {reveal.bazi.monthTenGod}):{' '}
              {TEN_GOD_PLAIN[reveal.bazi.monthTenGod]}
            </p>
          )}
          <p className="ob-lens-sub">
            "Mã thời gian" của bạn — Tứ Trụ: năm {reveal.bazi.yearPillar} · tháng{' '}
            {reveal.bazi.monthPillar} · ngày {reveal.bazi.dayPillar}
            {reveal.bazi.hourPillar && <> · giờ {reveal.bazi.hourPillar}</>}.
          </p>
          <p className="ob-lens-sub">
            {reveal.bazi.hourPillar ? (
              <>
                {reveal.bazi.strongest && (
                  <>
                    Trong bạn, chất {reveal.bazi.strongest} đang trội —{' '}
                    {NGU_HANH_PLAIN[reveal.bazi.strongest]?.vuong}.
                  </>
                )}
                {reveal.bazi.missing.length > 0 && (
                  <>
                    {' '}
                    Hơi thiếu chất {reveal.bazi.missing.join(', ')} —{' '}
                    {NGU_HANH_PLAIN[reveal.bazi.missing[0]!]?.thieu}.
                  </>
                )}
              </>
            ) : (
              <>Thêm giờ sinh (không bắt buộc) để mở FULL: trụ giờ, bản đồ ngũ hành, sao đáng chú ý, kết nối các trụ và vận năm nay.</>
            )}
          </p>
          {/* FULL — chỉ khi nhập đủ giờ (4 trụ thật, không suy diễn từ giờ giả định). */}
          {reveal.bazi.elementCount && (
            <p className="ob-lens-sub">
              Bản đồ ngũ hành (8 chữ):{' '}
              {['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy']
                .map((el) => `${el} ${reveal.bazi.elementCount![el] ?? 0}`)
                .join(' · ')}
              .
            </p>
          )}
          {reveal.bazi.hourTenGod && TEN_GOD_PLAIN[reveal.bazi.hourTenGod] && (
            <p className="ob-lens-sub">
              Trụ giờ — hậu vận &amp; đời sau ({reveal.bazi.hourTenGod}):{' '}
              {TEN_GOD_PLAIN[reveal.bazi.hourTenGod]}
            </p>
          )}
          {reveal.bazi.relations.length > 0 && (
            <p className="ob-lens-sub">
              Kết nối giữa các trụ:{' '}
              {reveal.bazi.relations
                .map((r) => `${r.type} ${r.chi} — ${r.detail}`)
                .join(' · ')}
            </p>
          )}
          {reveal.bazi.thanSat.length > 0 && (
            <p className="ob-lens-sub">
              Sao đáng chú ý:{' '}
              {reveal.bazi.thanSat.map((t) => `${t.name} — ${t.meaning}`).join(' · ')}
            </p>
          )}
          {reveal.bazi.namNay && TEN_GOD_PLAIN[reveal.bazi.namNay.tenGod] && (
            <p className="ob-lens-sub">
              Năm nay {reveal.bazi.namNay.label} với bạn mang năng lượng{' '}
              {reveal.bazi.namNay.tenGod}: {TEN_GOD_PLAIN[reveal.bazi.namNay.tenGod]}
            </p>
          )}
        </div>

        {/* Cầu nối sang sản phẩm chính: Bát Tự = "chất" → Tử Vi = bản đồ 12
            lĩnh vực đời (đủ 12 cung, dịch đời thường, khớp palace-readings). */}
        <p className="ob-reveal-body">
          Bát Tự vừa cho biết <strong>&ldquo;chất&rdquo;</strong> của bạn. Lá số{' '}
          <strong>Tử Vi đầy đủ</strong> sẽ vẽ tiếp bản đồ{' '}
          <strong>12 lĩnh vực đời</strong>: con người bạn (Mệnh) · cha mẹ · anh chị em ·
          hôn nhân · con cái · tiền bạc · sự nghiệp · nhà đất · sức khỏe · đi xa &amp; cơ
          hội bên ngoài · bạn bè quý nhân · phúc đức — kèm đại vận từng chặng 10 năm.
          Cần giờ sinh chính xác để lập.
        </p>
        <div className="ob-reveal-actions">
          <a
            href="/onboarding?intent=self"
            draggable={false}
            className="ob-reveal-cta font-mono text-editorial-mono uppercase tracking-[0.12em]"
          >
            Xem bức tranh đầy đủ →
          </a>
          <button type="button" className="ob-reveal-again" onClick={onReset}>
            Thử ngày khác
          </button>
        </div>
      </div>
    </div>
  );
}
