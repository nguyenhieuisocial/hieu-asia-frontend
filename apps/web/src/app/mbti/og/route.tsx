import { ImageResponse } from 'next/og';
import { scoreFromShare } from '@/lib/scoring/mbti';
import { buildType } from '@/lib/mbti-type-data';

// Ảnh xem-trước (OG) ĐỘNG theo kết quả MBTI — link chia sẻ
// "/mbti?r=EI-SN-TF-JP" hiện "Tôi là INTJ · Nhà Chiến Lược" thay vì ảnh
// generic → click nhiều hơn hẳn. Kết quả trắc nghiệm tính cách là loại nội
// dung được chia sẻ nhiều nhất, nên đây là mắt xích đáng đóng cho vòng
// lan-truyền (kênh traffic không phụ thuộc backlink/thứ-hạng). Dùng
// scoreFromShare + buildType (thuần TS, server-side; scoring/mbti.ts chỉ
// `import type` PersonalityQuiz nên không kéo client-component vào bundle).
// Khung tối + vàng đồng bộ OG Tử Vi / Bát Tự; font mặc định render được dấu.

export const alt = 'MBTI — 16 kiểu tâm trí — hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function GET(req: Request) {
  const r = new URL(req.url).searchParams.get('r') ?? '';

  let personal: { code: string; nick: string } | null = null;
  try {
    const parts = r.split('-').map((n) => parseInt(n, 10));
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      const scored = scoreFromShare(parts);
      const meta = scored ? buildType(scored.type) : null;
      if (meta) personal = { code: meta.code, nick: meta.nick };
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
          backgroundImage: 'radial-gradient(ellipse at center top, #14202a 0%, #0F0F12 60%)',
          padding: '60px 76px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 26, color: '#B8923D', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex' }}>
          hieu.asia · MBTI
        </div>

        {personal ? (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, color: 'rgba(242,237,227,0.7)', display: 'flex' }}>
              Kiểu tâm trí của tôi
            </div>
            <div style={{ marginTop: 6, fontSize: 168, fontWeight: 700, color: '#D4B25A', lineHeight: 1.0, letterSpacing: '0.05em', display: 'flex' }}>
              {personal.code}
            </div>
            <div style={{ marginTop: 16, fontSize: 54, color: 'rgba(242,237,227,0.85)', display: 'flex' }}>
              {personal.nick}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 84, fontWeight: 700, color: '#D4B25A', lineHeight: 1.05, display: 'flex' }}>
              MBTI — 16 kiểu tâm trí
            </div>
            <div style={{ marginTop: 26, fontSize: 36, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
              4 trục · 16 kiểu · một ngôn ngữ tự nhận diện
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: 'rgba(242,237,227,0.6)', display: 'flex' }}>
            Không nhãn dán — một ngôn ngữ để nhận diện thiên hướng của bạn.
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: 'rgba(242,237,227,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex' }}>
            Làm thử · hieu.asia/mbti
          </div>
        </div>
      </div>
    ),
    size,
  );
}
