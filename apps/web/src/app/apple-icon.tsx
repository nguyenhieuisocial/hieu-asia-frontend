import { ImageResponse } from 'next/og';

/**
 * Apple touch icon 180×180 — symbol mark "H" của hieu.asia, scaled lên.
 * Dùng đúng cấu trúc box-stack với <SymbolMark> SVG để giữ visual parity.
 */

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 32,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: 100,
            height: 120,
          }}
        >
          {/* left vertical */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 18,
              height: 120,
              background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 9,
            }}
          />
          {/* right vertical */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 18,
              height: 120,
              background: 'linear-gradient(180deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 9,
            }}
          />
          {/* crossbar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 51,
              width: 100,
              height: 18,
              background: 'linear-gradient(90deg, #D4B25A 0%, #B8923D 100%)',
              borderRadius: 9,
            }}
          />
        </div>
        {/* accent dot */}
        <div
          style={{
            position: 'absolute',
            right: 30,
            bottom: 30,
            width: 8,
            height: 8,
            background: '#B8923D',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    size,
  );
}
