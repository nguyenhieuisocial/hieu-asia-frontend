import { ImageResponse } from 'next/og';

/**
 * Dynamic OG image for /affiliate/leaderboard — Wave 48.
 *
 * Renders top 3 affiliate codes + total earned across the leaderboard.
 * Falls back to a static-style image if the upstream is empty/unreachable.
 *
 * PII guard: same upstream as the page (mv_affiliate_leaderboard) — only
 * affiliate_code, tier, and totals are read. user_id is never accessed.
 */

export const alt = 'Bảng vàng Affiliate hieu.asia — Top 50';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export const revalidate = 60;

interface Row {
  affiliate_code: string;
  total_earned_vnd: number;
}

async function loadTop3(): Promise<{ top3: Row[]; total: number }> {
  try {
    const r = await fetch(`${HIEU_API_URL}/affiliate/leaderboard?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return { top3: [], total: 0 };
    const d = (await r.json()) as {
      ok?: boolean;
      leaderboard?: Array<{
        affiliate_code?: string;
        code?: string;
        total_earned_vnd?: number | string | null;
        total_earned?: number;
      }>;
    };
    if (!d.ok || !Array.isArray(d.leaderboard)) return { top3: [], total: 0 };
    const rows: Row[] = d.leaderboard.map((row) => ({
      affiliate_code: row.affiliate_code ?? row.code ?? '',
      total_earned_vnd: Number(row.total_earned_vnd ?? row.total_earned ?? 0),
    }));
    const total = rows.reduce((s, r) => s + r.total_earned_vnd, 0);
    return { top3: rows.slice(0, 3), total };
  } catch {
    return { top3: [], total: 0 };
  }
}

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default async function LeaderboardOgImage() {
  const { top3, total } = await loadTop3();

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
          padding: '72px 96px',
          fontFamily: 'serif',
        }}
      >
        {/* Header eyebrow */}
        <div
          style={{
            fontSize: 24,
            color: '#B8923D',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          hieu.asia · Affiliate
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 16,
            fontSize: 84,
            fontWeight: 700,
            color: '#F2EDE3',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            display: 'flex',
          }}
        >
          Bảng vàng <span style={{ color: '#D4B25A', marginLeft: 18 }}>Top 50</span>
        </div>

        {/* Total earned */}
        {total > 0 && (
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: 'rgba(242, 237, 227, 0.78)',
              display: 'flex',
            }}
          >
            Cộng đồng đã kiếm{' '}
            <strong style={{ color: '#D4B25A', marginLeft: 14, fontWeight: 700 }}>
              {vnd(total)}
            </strong>
          </div>
        )}

        {/* Top 3 cards */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
            justifyContent: 'space-between',
          }}
        >
          {top3.length === 0
            ? [0].map((_) => (
                <div
                  key="empty"
                  style={{
                    flex: 1,
                    display: 'flex',
                    color: 'rgba(242, 237, 227, 0.5)',
                    fontSize: 28,
                  }}
                >
                  Hãy là người đầu tiên trên bảng vàng.
                </div>
              ))
            : top3.map((row, idx) => (
                <div
                  key={row.affiliate_code || idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 24,
                    borderRadius: 18,
                    border: `2px solid ${idx === 0 ? 'rgba(212,178,90,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    background:
                      idx === 0
                        ? 'linear-gradient(180deg, rgba(212,178,90,0.18) 0%, rgba(15,15,18,0.6) 100%)'
                        : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ fontSize: 44, display: 'flex' }}>{MEDALS[idx]}</div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 18,
                      color: 'rgba(242, 237, 227, 0.6)',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      display: 'flex',
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 26,
                      fontFamily: 'monospace',
                      color: '#F2EDE3',
                      fontWeight: 600,
                      display: 'flex',
                    }}
                  >
                    {row.affiliate_code || '—'}
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 28,
                      color: '#D4B25A',
                      fontWeight: 700,
                      display: 'flex',
                    }}
                  >
                    {vnd(row.total_earned_vnd)}
                  </div>
                </div>
              ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: 'rgba(242, 237, 227, 0.55)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          hieu.asia/affiliate/leaderboard
        </div>
      </div>
    ),
    size,
  );
}
