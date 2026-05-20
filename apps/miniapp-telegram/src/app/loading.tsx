export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center text-cream">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-cream/55">
          Đang tải…
        </p>
      </div>
    </main>
  );
}
