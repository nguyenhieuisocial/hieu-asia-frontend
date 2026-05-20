'use client';

/**
 * Root-level error boundary. Renders its own <html>/<body>.
 * Catches errors thrown in the root layout (including providers).
 * Keep it dependency-free — UI primitives may fail when this triggers.
 */
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
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#B8923D',
              marginBottom: 16,
            }}
          >
            Critical error
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
            Ứng dụng gặp lỗi nghiêm trọng
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(242, 237, 227, 0.7)', marginBottom: 24 }}>
            Vui lòng tải lại trang. Nếu lỗi tiếp diễn, liên hệ support@hieu.asia.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'rgba(242, 237, 227, 0.4)',
                marginBottom: 24,
              }}
            >
              Mã lỗi: {error.digest}
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
            }}
          >
            Tải lại
          </button>
        </div>
      </body>
    </html>
  );
}
