'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F0F12',
          color: '#F2EDE3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 360, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ef4444',
              marginBottom: 12,
            }}
          >
            Mini App · Critical
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
            Không khởi động được
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(242, 237, 227, 0.7)', marginBottom: 20 }}>
            Đóng Mini App rồi mở lại từ Telegram, hoặc dùng web app trên trình duyệt.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(242, 237, 227, 0.4)',
                marginBottom: 20,
              }}
            >
              {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#B8923D',
              color: '#0F0F12',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
