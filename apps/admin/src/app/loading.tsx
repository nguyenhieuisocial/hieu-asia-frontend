export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-foreground">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Đang tải dữ liệu vận hành…
        </p>
      </div>
    </div>
  );
}
