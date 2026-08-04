import * as React from 'react';
import type { Reveal } from './types';

// Đợt 2 — 1 nguồn cho lăng kính Cổ học & Chiêm tinh, dùng chung ở bảng tổng
// ("Lát cắt về bạn") lẫn bảng chạm-từng-nhóm sao. Trả null khi chưa soi.
export function DongLensCard({ reveal }: { reveal: Reveal }): React.JSX.Element | null {
  const hopColors = reveal
    ? Array.from(new Set([...reveal.dong.banMenhColors, ...reveal.dong.hopColors])).slice(0, 4)
    : [];
  return reveal ? (
    <div className="ob-lens">
      <span className="ob-lens-tag">Cổ học Á Đông</span>
      <p className="ob-lens-line">
        <strong>
          Tuổi {reveal.dong.canChi} · con {reveal.conVat}
        </strong>{' '}
        — mệnh {reveal.dong.elementName} ({reveal.dong.napAmName}).
      </p>
      {reveal.cg && (
        <p className="ob-lens-sub">
          Tuổi {reveal.conVat}: {reveal.cg.tagline}
          {reveal.cg.strengths.length > 0 && (
            <> Nổi bật: {reveal.cg.strengths.join(' · ')}.</>
          )}
          {reveal.cg.growthEdge && <> Nên luyện: {reveal.cg.growthEdge}</>}
        </p>
      )}
      {reveal.cg?.love && <p className="ob-lens-sub">Tình cảm: {reveal.cg.love}</p>}
      <p className="ob-lens-sub">
        {reveal.dong.sinhElementName} sinh {reveal.dong.elementName} (tương sinh) ·{' '}
        {reveal.dong.khacElementName} khắc {reveal.dong.elementName} (nên tiết chế).{' '}
        {hopColors.length > 0 && <>Hợp màu {hopColors.join(', ')}. </>}
        {reveal.dong.avoidColors.length > 0 && (
          <>Nên tiết chế màu {reveal.dong.avoidColors.join(', ')}. </>
        )}
        {reveal.dong.careers.length > 0 && (
          <>Hợp hướng nghề {reveal.dong.careers.slice(0, 2).join(', ')}.</>
        )}
      </p>
      {(reveal.huongTot.length > 0 || reveal.vatPham.length > 0 || reveal.loiKhuyen) && (
        <p className="ob-lens-sub">
          {reveal.huongTot.length > 0 && <>Hướng tốt: {reveal.huongTot.join(', ')}. </>}
          {reveal.vatPham.length > 0 && <>Vật phẩm hợp: {reveal.vatPham.join('; ')}. </>}
          {reveal.loiKhuyen && <>Gợi ý: {reveal.loiKhuyen}</>}
        </p>
      )}
      {reveal.lunarAdjusted && (
        <p className="ob-lens-sub">
          Bạn sinh trước Lập Xuân — tuổi âm tính theo năm {reveal.dong.year} (chuẩn mệnh
          học, khớp trụ năm Bát Tự).
        </p>
      )}
    </div>
  ) : null;
}

export function TayLensCard({ reveal }: { reveal: Reveal }): React.JSX.Element | null {
  return reveal?.tay ? (
    <div className="ob-lens">
      <span className="ob-lens-tag">Chiêm tinh phương Tây</span>
      <p className="ob-lens-line">
        <strong>
          Cung {reveal.tay.name} {reveal.tay.symbol}
        </strong>
      </p>
      <p className="ob-lens-sub">
        Nhóm {reveal.tay.element} · {reveal.tay.quality} · chủ quản {reveal.tay.rulingPlanet}.{' '}
        {reveal.tay.tagline}
        {reveal.nearCusp && ' (sinh sát ranh giới cung — cần giờ sinh để chắc chắn).'}
      </p>
      {reveal.tay.strengths.length > 0 && (
        <p className="ob-lens-sub">
          Nổi bật: {reveal.tay.strengths.join(' · ')}. {reveal.tay.work}
          {reveal.tay.growthEdge && <> Nên luyện: {reveal.tay.growthEdge}</>}
        </p>
      )}
      {reveal.tay.love && <p className="ob-lens-sub">Tình cảm: {reveal.tay.love}</p>}
      <p className="ob-lens-sub">Cung đối: {reveal.tay.opposite} — vừa hút vừa thử thách.</p>
    </div>
  ) : null;
}
