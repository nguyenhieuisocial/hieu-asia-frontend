export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Đang tải…
        </p>
      </div>
    </main>
  );
}
