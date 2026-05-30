import { ImageResponse } from 'next/og';

export const alt = 'Rút bài Tarot · gợi ý phản tư — hieu.asia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TarotOgImage() {
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
            'radial-gradient(ellipse at center top, #1a1228 0%, #0F0F12 60%)',
          padding: '72px 96px',
          fontFamily: 'serif',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 24,
            color: '#B8923D',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          hieu.asia · Phản tư
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 20,
            fontSize: 88,
            fontWeight: 700,
            color: '#D4B25A',
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            display: 'flex',
          }}
        >
          Rút bài Tarot
        </div>

        {/* Dot separator */}
        <div
          style={{
            marginTop: 16,
            fontSize: 36,
            color: 'rgba(212,178,90,0.5)',
            letterSpacing: '0.2em',
            display: 'flex',
          }}
        >
          · · ·
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: 'rgba(242, 237, 227, 0.6)',
            lineHeight: 1.5,
            display: 'flex',
            maxWidth: 760,
          }}
        >
          Gợi ý phản tư — không phán số, không bói toán.
        </div>

        {/* Card icons row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
          }}
        >
          {['☽', '☀', '★', '♦'].map((sym, i) => (
            <div
              key={i}
              style={{
                width: 72,
                height: 112,
                borderRadius: 10,
                border: '1px solid rgba(212,178,90,0.35)',
                background:
                  i === 1
                    ? 'linear-gradient(160deg, rgba(212,178,90,0.22) 0%, rgba(15,15,18,0.7) 100%)'
                    : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                color: i === 1 ? '#D4B25A' : 'rgba(242,237,227,0.4)',
              }}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: 'rgba(242, 237, 227, 0.45)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          hieu.asia/tarot
        </div>
      </div>
    ),
    size,
  );
}
