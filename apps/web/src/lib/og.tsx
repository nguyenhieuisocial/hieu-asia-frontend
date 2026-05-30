import { ImageResponse } from 'next/og';

/**
 * Helper dựng OG card branded (1200×630) cho các trang công cụ.
 * Inline-style thuần (yêu cầu của satori/next-og — không Tailwind).
 * Brand: ink #0F0F12, gold #D4B25A, cream #F2EDE3.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function toolOgImage(opts: {
  eyebrow: string;
  title: string;
  accent?: string;
  tagline: string;
}) {
  const { eyebrow, title, accent, tagline } = opts;
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
          padding: '80px 96px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#B8923D',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: 96,
              fontWeight: 700,
              color: '#F2EDE3',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            {title}
            {accent ? <span style={{ color: '#D4B25A', marginLeft: 20 }}>{accent}</span> : null}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 34,
              color: 'rgba(242, 237, 227, 0.8)',
              lineHeight: 1.3,
              maxWidth: 920,
            }}
          >
            {tagline}
          </div>
        </div>

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
    ),
    OG_SIZE,
  );
}
