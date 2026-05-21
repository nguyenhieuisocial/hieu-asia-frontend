import { ImageResponse } from 'next/og';

export const alt = 'hieu.asia — Tử Vi, MBTI, palm reading bằng AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F0F12',
          backgroundImage:
            'radial-gradient(ellipse at top left, #2a1d0a 0%, #0F0F12 55%)',
          padding: '80px 96px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 96,
            fontSize: 28,
            color: '#B8923D',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontWeight: 500,
            display: 'flex',
          }}
        >
          Premium AI insight
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 140,
              fontWeight: 700,
              color: '#F2EDE3',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            hieu<span style={{ color: '#B8923D' }}>.asia</span>
          </div>
          <div
            style={{
              fontSize: 40,
              color: 'rgba(242, 237, 227, 0.85)',
              lineHeight: 1.3,
              maxWidth: 900,
              display: 'flex',
            }}
          >
            Tử Vi · MBTI · Palm Reading bằng AI
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(242, 237, 227, 0.6)',
              marginTop: 8,
              display: 'flex',
            }}
          >
            Người bạn đồng hành để hiểu chính mình
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 96,
            fontSize: 22,
            color: '#B8923D',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          hieu.asia
        </div>
      </div>
    ),
    size,
  );
}
