export default function ProcessingLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-radial text-cream">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-5 font-mono text-xs uppercase tracking-widest text-gold/80">
          Khởi tạo hội đồng agent
        </p>
        <p className="mt-2 text-sm text-cream/65">Quy trình sẽ bắt đầu trong vài giây…</p>
      </div>
    </main>
  );
}
