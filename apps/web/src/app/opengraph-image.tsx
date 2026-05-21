import { ImageResponse } from 'next/og';

/**
 * OG image 1200×630 — share preview cho hieu.asia.
 * Embedded "H" symbol mark (box-stack tương đương SymbolMark SVG) + wordmark + tagline.
 */

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
        {/* Symbol mark — top left */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 96,
            width: 96,
            height: 96,
            background: 'linear-gradient(135deg, #0F0F12 0%, #1A0E2E 100%)',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: 56, height: 68, display: 'flex' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 10,
                height: 68,
                background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
                borderRadius: 5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 10,
                height: 68,
                background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
                borderRadius: 5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 29,
                width: 56,
                height: 10,
                background: 'linear-gradient(90deg, #D4B25A 0%, #B8923D 100%)',
                borderRadius: 5,
              }}
            />
          </div>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 224,
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

        {/* Main wordmark + tagline */}
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

        {/* Bottom right small wordmark */}
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
          hieu.asia/brand
        </div>
      </div>
    ),
    size,
  );
}
