import { ImageResponse } from 'next/og';

/**
 * Favicon 32×32 — symbol mark "H" của hieu.asia.
 * Vẽ bằng linear-gradient + box CSS, đồng bộ với <SymbolMark> SVG.
 */

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F0F12 0%, #1A0E2E 100%)',
          borderRadius: 6,
          position: 'relative',
        }}
      >
        {/* H bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
            width: 18,
            height: 22,
          }}
        >
          {/* left vertical */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 3,
              height: 22,
              background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 1.5,
            }}
          />
          {/* right vertical */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 3,
              height: 22,
              background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 1.5,
            }}
          />
          {/* crossbar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 9.5,
              width: 18,
              height: 3,
              background: 'linear-gradient(90deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 1.5,
            }}
          />
        </div>
        {/* accent dot — "asia" suffix */}
        <div
          style={{
            position: 'absolute',
            right: 5,
            bottom: 5,
            width: 2.5,
            height: 2.5,
            background: '#B8923D',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    size,
  );
}
