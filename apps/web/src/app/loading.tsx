export default function Loading() {
  // V4-FIX BUG-029: was <main>. With Next.js streaming, this loading boundary
  // SSR-ships BEFORE the page.tsx <main> renders, so the streamed HTML
  // contains TWO <main> elements (a11y violation `landmark-no-duplicate-main`
  // + W3C "document must not include more than one visible main element").
  // Use <div> + role="status" instead — the page's own <main> remains the
  // sole landmark; the loading state is transient + announced via aria-live.
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background text-foreground"
    >
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Đang tải…
        </p>
      </div>
    </div>
  );
}
