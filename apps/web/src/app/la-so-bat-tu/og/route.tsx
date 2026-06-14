import { ImageResponse } from 'next/og';
import { calculateBazi, type Element } from '@/lib/bazi';

// Ảnh xem-trước (OG) ĐỘNG theo lá số — để link chia sẻ trên FB/Zalo hiện đúng
// 4 trụ của người gửi (khoe "lá số CỦA TÔI" → click nhiều hơn). Engine `bazi.ts`
// thuần TS chạy server-side. Khung tối + vàng (giống OG tarot), font mặc định
// render được dấu tiếng Việt.

export const alt = 'Lá số Bát Tự (Tứ Trụ) — hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const EL_HEX: Record<Element, string> = {
  Mộc: '#34d399',
  Hỏa: '#fb7185',
  Thổ: '#fbbf24',
  Kim: '#e2e8f0',
  Thủy: '#38bdf8',
};

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const d = sp.get('d') ?? '';
  const t = sp.get('t') ?? '12:00';
  const g: 'M' | 'F' = sp.get('g') === 'F' ? 'F' : 'M';

  let pillars: { label: string; can: string; chi: string; canEl: Element; chiEl: Element }[] | null = null;
  let nhatChuLine = '';
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const hh = parseInt(t.slice(0, 2), 10);
      const c = calculateBazi({ birthSolarDate: d, birthHour: Number.isFinite(hh) ? hh : 12, gender: g });
      pillars = [
        { label: 'Năm', can: c.year.can, chi: c.year.chi, canEl: c.year.canElement, chiEl: c.year.chiElement },
        { label: 'Tháng', can: c.month.can, chi: c.month.chi, canEl: c.month.canElement, chiEl: c.month.chiElement },
        { label: 'Ngày', can: c.day.can, chi: c.day.chi, canEl: c.day.canElement, chiEl: c.day.chiElement },
        { label: 'Giờ', can: c.hour.can, chi: c.hour.chi, canEl: c.hour.canElement, chiEl: c.hour.chiElement },
      ];
      nhatChuLine = `Nhật Chủ: ${c.dayMaster.can} (${c.dayMaster.element} ${c.dayMaster.yang ? 'dương' : 'âm'}) · ${c.strongest} vượng`;
    }
  } catch {
    pillars = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F0F12',
          backgroundImage: 'radial-gradient(ellipse at center top, #1a1228 0%, #0F0F12 60%)',
          padding: '60px 76px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 26, color: '#B8923D', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex' }}>
          hieu.asia · Lá số Bát Tự
        </div>

        {pillars && (
          <div style={{ marginTop: 44, display: 'flex', flexDirection: 'row', gap: 22, justifyContent: 'center' }}>
            {pillars.map((x) => (
              <div
                key={x.label}
                style={{
                  width: 232,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 16,
                  border: '1px solid rgba(212,178,90,0.3)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '22px 0',
                }}
              >
                <div style={{ fontSize: 22, color: 'rgba(242,237,227,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
                  {x.label}
                </div>
                <div style={{ marginTop: 14, fontSize: 66, fontWeight: 700, color: EL_HEX[x.canEl], lineHeight: 1.05, display: 'flex' }}>
                  {x.can}
                </div>
                <div style={{ fontSize: 66, fontWeight: 700, color: EL_HEX[x.chiEl], lineHeight: 1.05, display: 'flex' }}>
                  {x.chi}
                </div>
              </div>
            ))}
          </div>
        )}

        {pillars && (
          <div style={{ marginTop: 38, fontSize: 36, color: '#D4B25A', display: 'flex' }}>{nhatChuLine}</div>
        )}

        {!pillars && (
          <div style={{ marginTop: 48, fontSize: 84, fontWeight: 700, color: '#D4B25A', lineHeight: 1.05, display: 'flex' }}>
            Lá số Bát Tự (Tứ Trụ)
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
            Tính theo tiết khí chuẩn — con số là thật, không bói toán.
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: 'rgba(242,237,227,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
            Xem thử lá số của bạn · hieu.asia/la-so-bat-tu
          </div>
        </div>
      </div>
    ),
    size,
  );
}
