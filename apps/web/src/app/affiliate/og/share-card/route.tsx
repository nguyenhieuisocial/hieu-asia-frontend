import { ImageResponse } from 'next/og';

// Thẻ chia sẻ (OG) cho cộng tác viên: khung tối + vàng đúng brand (giống
// lib/og.tsx và la-so-bat-tu/og). Cộng tác viên mở link với mã của mình rồi
// chụp/lưu ảnh để đăng. Link giới thiệu được in THẲNG dưới dạng chữ vì
// next/og không fetch ảnh ngoài lúc render (QR nằm ở trang /affiliate/poster).
//
// Brand: ink #0F0F12, gold #D4B25A, eyebrow #B8923D, cream #F2EDE3. Không khai
// báo runtime/font riêng — giữ giống các route OG hiện có (Node + serif render
// được dấu tiếng Việt).

export const alt = 'Khám phá lá số của bạn cùng hieu.asia';
export const contentType = 'image/png';

// Chỉ giữ chữ–số an toàn, giới hạn độ dài để khớp regex mã CTV của app.
function sanitizeCode(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const code = sanitizeCode(sp.get('code'));
  const story = sp.get('fmt') === 'story';
  const size = story ? { width: 1080, height: 1920 } : { width: 1080, height: 1080 };
  const refUrl = code ? `hieu.asia/?ref=${code}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0F0F12',
          backgroundImage: 'radial-gradient(ellipse at top left, #2a1d0a 0%, #0F0F12 55%)',
          padding: story ? '120px 90px' : '96px 90px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#B8923D',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          hieu.asia
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: story ? 92 : 84,
              fontWeight: 700,
              color: '#F2EDE3',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Khám phá lá số của bạn cùng <span style={{ color: '#D4B25A', marginLeft: 18 }}>hieu.asia</span>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              fontSize: 36,
              color: 'rgba(242, 237, 227, 0.82)',
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            Tử Vi · Bát Tự · Thần số học. Minh bạch, không bói mù.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {refUrl ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 30px',
                borderRadius: 18,
                border: '1px solid rgba(212,178,90,0.35)',
                background: 'rgba(255,255,255,0.03)',
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  color: 'rgba(242,237,227,0.55)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                Link giới thiệu
              </div>
              <div style={{ display: 'flex', marginTop: 12, fontSize: 44, fontWeight: 700, color: '#D4B25A' }}>
                {refUrl}
              </div>
              <div style={{ display: 'flex', marginTop: 8, fontSize: 26, color: 'rgba(242,237,227,0.6)' }}>
                Mã giới thiệu: {code}
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: 'rgba(242, 237, 227, 0.55)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            hieu.asia · Hiểu mình. Quyết định mình.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
