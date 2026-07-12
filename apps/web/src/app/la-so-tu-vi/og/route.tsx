import { ImageResponse } from 'next/og';
import { calculateBazi } from '@/lib/bazi';

// Ảnh xem-trước (OG) ĐỘNG theo lá số Tử Vi — để link chia sẻ trên FB/Zalo hiện
// "lá số CỦA TÔI" (ngày sinh + con giáp + can-chi năm) → click nhiều hơn ảnh
// generic. Engine Tử Vi (iztro) chạy qua worker + localStorage nên KHÔNG gọi
// được inline ở đây; thay vào đó dùng `bazi.ts` (thuần TS, server-side) chỉ để
// lấy trụ năm (con giáp + can-chi) theo tiết khí — nhẹ, tin cậy, không phụ thuộc
// worker (OG phải render nhanh & không bao giờ lỗi khi crawler gọi). Khung tối +
// vàng (giống OG Bát Tự / tarot), font mặc định render được dấu tiếng Việt.

export const alt = 'Lá số Tử Vi — hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Địa chi → con giáp (12 con). Trụ năm tính theo tiết khí (đổi tại Lập Xuân) nên
// con giáp ở đây đúng chuẩn mệnh lý, nhất quán với engine Bát Tự của site.
const CON_GIAP: Record<string, string> = {
  Tý: 'Chuột',
  Sửu: 'Trâu',
  Dần: 'Hổ',
  Mão: 'Mèo',
  Thìn: 'Rồng',
  Tỵ: 'Rắn',
  Ngọ: 'Ngựa',
  Mùi: 'Dê',
  Thân: 'Khỉ',
  Dậu: 'Gà',
  Tuất: 'Chó',
  Hợi: 'Lợn',
};

function formatDMY(d: string): string {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const d = sp.get('d') ?? '';
  const t = sp.get('t') ?? '12:00';
  const g: 'M' | 'F' = sp.get('g') === 'F' ? 'F' : 'M';

  let personal: { dob: string; conGiap: string; yearPillar: string } | null = null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const hh = parseInt(t.slice(0, 2), 10);
      const c = calculateBazi({ birthSolarDate: d, birthHour: Number.isFinite(hh) ? hh : 12, gender: g });
      personal = {
        dob: formatDMY(d),
        conGiap: CON_GIAP[c.year.chi] ?? '',
        yearPillar: `${c.year.can} ${c.year.chi}`,
      };
    }
  } catch {
    personal = null;
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
          hieu.asia · Lá số Tử Vi
        </div>

        {personal ? (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 84, fontWeight: 700, color: '#D4B25A', lineHeight: 1.05, display: 'flex' }}>
              Lá số Tử Vi của tôi
            </div>
            <div style={{ marginTop: 30, fontSize: 42, color: 'rgba(242,237,227,0.8)', display: 'flex' }}>
              Sinh {personal.dob}
              {personal.conGiap ? ` · Tuổi ${personal.conGiap} (${personal.yearPillar})` : ''}
            </div>
            <div style={{ marginTop: 22, fontSize: 32, color: 'rgba(242,237,227,0.5)', display: 'flex' }}>
              12 cung · 121 sao · Tứ Hóa · độ sáng miếu–vượng–hãm
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 84, fontWeight: 700, color: '#D4B25A', lineHeight: 1.05, display: 'flex' }}>
              Lá số Tử Vi
            </div>
            <div style={{ marginTop: 26, fontSize: 36, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
              12 cung · 121 sao · độ sáng & Tứ Hóa
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
            An sao bằng engine chuẩn — con số là thật, không bói toán.
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: 'rgba(242,237,227,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
            Xem thử lá số của bạn · hieu.asia/la-so-tu-vi
          </div>
        </div>
      </div>
    ),
    size,
  );
}
