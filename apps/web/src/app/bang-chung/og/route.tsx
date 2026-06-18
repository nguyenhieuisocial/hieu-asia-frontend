import { ImageResponse } from 'next/og';

// Ảnh xem-trước (OG) ĐỘNG cho thẻ chia-sẻ "Bằng Chứng" — khi link unfurl trên
// FB/Zalo/Telegram, hiện kết quả kiểm-chứng CỦA NGƯỜI GỬI (khoe "lá số ghi đúng
// đời TÔI" → click nhiều hơn). RIÊNG TƯ: chỉ nhận con số TỔNG HỢP (hit/total/strong),
// KHÔNG sự-kiện, KHÔNG ngày sinh. Khung tối + vàng (đồng bộ OG Bát Tự).
//
// Khung lời: "GHI ĐÚNG ... mốc đời thật — kiểm chứng được, không bói mù" (bằng-chứng
// kiểm-chứng-được, KHÔNG phải "bói đúng X%"). Mức base-rate + giới hạn nằm ở trang.

export const alt = 'Bằng Chứng — kiểm chứng lá số bằng quá khứ thật · hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function clampInt(v: string | null, min: number, max: number): number | null {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const total = clampInt(sp.get('total'), 1, 7);
  const hitRaw = clampInt(sp.get('hit'), 0, 7);
  const strongRaw = clampInt(sp.get('strong'), 0, 7);
  // Only render the personalized card when the numbers are internally consistent.
  const valid = total != null && hitRaw != null && hitRaw <= total;
  const hit = valid ? hitRaw! : 0;
  const strong = valid && strongRaw != null && strongRaw <= hit ? strongRaw! : 0;

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
          hieu.asia · Bằng Chứng
        </div>

        {valid ? (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, color: 'rgba(242,237,227,0.7)', display: 'flex' }}>
              Tôi đối chiếu lá số với quá khứ thật —
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline' }}>
              <div style={{ fontSize: 180, fontWeight: 700, color: '#D4B25A', lineHeight: 1, display: 'flex' }}>
                {hit}
              </div>
              <div style={{ fontSize: 84, fontWeight: 700, color: 'rgba(242,237,227,0.5)', display: 'flex' }}>
                /{total}
              </div>
              <div style={{ marginLeft: 28, fontSize: 44, color: 'rgba(242,237,227,0.75)', display: 'flex' }}>
                mốc đời KHỚP
              </div>
            </div>
            {strong > 0 && (
              <div style={{ marginTop: 18, fontSize: 34, color: '#34d399', display: 'flex' }}>
                {strong} mốc khớp đúng lĩnh vực — đối chiếu được, không phải bói.
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: 76, fontWeight: 700, color: '#D4B25A', lineHeight: 1.1, display: 'flex' }}>
            Kiểm chứng lá số bằng chính quá khứ của bạn
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
            Kiểm chứng trước khi tin — không bói mù.
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: 'rgba(242,237,227,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
            Thử với đời bạn · hieu.asia/bang-chung
          </div>
        </div>
      </div>
    ),
    size,
  );
}
