import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 130,
          background: '#0F0F12',
          color: '#B8923D',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontFamily: 'serif',
          letterSpacing: '-0.05em',
          borderRadius: 32,
        }}
      >
        H
      </div>
    ),
    size,
  );
}
