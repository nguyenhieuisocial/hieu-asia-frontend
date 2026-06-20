import { ImageResponse } from 'next/og';
import { calculateBazi, type Element } from '@/lib/bazi';

// Thẻ "lá số mẫu" (OG 1200×630) cho cộng tác viên đăng để mời click. Tái dùng
// đúng khối JSX 4 trụ của la-so-bat-tu/og + engine bazi.ts (thuần TS, chạy
// server-side), với NGÀY DEMO CỐ ĐỊNH để ảnh luôn đẹp & ổn định. Dưới cùng là
// CTA + link giới thiệu của cộng tác viên (in dạng chữ — next/og không fetch
// ảnh ngoài, nên QR nằm ở trang /affiliate/poster, không phải ở đây).
//
// Brand: ink #0F0F12, gold #D4B25A, cream #F2EDE3 — khớp lib/og.tsx. Không khai
// báo runtime/font riêng, giống các route OG hiện có.

export const alt = 'Lá số mẫu · hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Ngày demo dễ chịu: 15/08/1995 lúc 10:00. Luôn render ra cùng một lá số đẹp.
const DEMO_DATE = '1995-08-15';
const DEMO_HOUR = 10;

const EL_HEX: Record<Element, string> = {
  Mộc: '#34d399',
  Hỏa: '#fb7185',
  Thổ: '#fbbf24',
  Kim: '#e2e8f0',
  Thủy: '#38bdf8',
};

function sanitizeCode(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const code = sanitizeCode(sp.get('code'));
  const refUrl = code ? `hieu.asia/?ref=${code}` : 'hieu.asia';

  let pillars: { label: string; can: string; chi: string; canEl: Element; chiEl: Element }[] | null = null;
  let nhatChuLine = '';
  try {
    const c = calculateBazi({ birthSolarDate: DEMO_DATE, birthHour: DEMO_HOUR, gender: 'M' });
    pillars = [
      { label: 'Năm', can: c.year.can, chi: c.year.chi, canEl: c.year.canElement, chiEl: c.year.chiElement },
      { label: 'Tháng', can: c.month.can, chi: c.month.chi, canEl: c.month.canElement, chiEl: c.month.chiElement },
      { label: 'Ngày', can: c.day.can, chi: c.day.chi, canEl: c.day.canElement, chiEl: c.day.chiElement },
      { label: 'Giờ', can: c.hour.can, chi: c.hour.chi, canEl: c.hour.canElement, chiEl: c.hour.chiElement },
    ];
    nhatChuLine = `Nhật Chủ: ${c.dayMaster.can} (${c.dayMaster.element} ${c.dayMaster.yang ? 'dương' : 'âm'}) · ${c.strongest} vượng`;
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
          padding: '52px 76px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 26, color: '#B8923D', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex' }}>
          hieu.asia · Lá số mẫu
        </div>

        {pillars && (
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'row', gap: 22, justifyContent: 'center' }}>
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
                  padding: '20px 0',
                }}
              >
                <div style={{ fontSize: 22, color: 'rgba(242,237,227,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
                  {x.label}
                </div>
                <div style={{ marginTop: 12, fontSize: 60, fontWeight: 700, color: EL_HEX[x.canEl], lineHeight: 1.05, display: 'flex' }}>
                  {x.can}
                </div>
                <div style={{ fontSize: 60, fontWeight: 700, color: EL_HEX[x.chiEl], lineHeight: 1.05, display: 'flex' }}>
                  {x.chi}
                </div>
              </div>
            ))}
          </div>
        )}

        {pillars && (
          <div style={{ marginTop: 28, fontSize: 34, color: '#D4B25A', display: 'flex', justifyContent: 'center' }}>{nhatChuLine}</div>
        )}

        {!pillars && (
          <div style={{ marginTop: 40, fontSize: 80, fontWeight: 700, color: '#D4B25A', lineHeight: 1.05, display: 'flex' }}>
            Lá số Bát Tự (Tứ Trụ)
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: 'rgba(242,237,227,0.78)', display: 'flex' }}>
            Lập lá số của riêng bạn. Tính theo tiết khí chuẩn, không bói mù.
          </div>
          <div style={{ marginTop: 14, fontSize: 28, color: '#D4B25A', letterSpacing: '0.12em', display: 'flex' }}>
            {refUrl}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
