/**
 * Minimal markdown → HTML renderer cho /cam-nang/[slug].
 *
 * Cố ý viết tay thay vì kéo `marked` / `react-markdown` vào, để bundle của route
 * RSC này gần bằng 0 — chỉ cần bọc đoạn văn + nhận heading/list/link/đậm.
 *
 * ⚠️ Output đi thẳng vào `dangerouslySetInnerHTML`, còn `pillar.content` thì lấy
 * từ API nội dung — KHÔNG do repo này kiểm soát. Đừng dựa vào "nội dung đã sạch
 * vì qua pipeline LLM + founder duyệt": đó là giả định về nguồn, không phải bảo
 * đảm của code. Hai tính chất bên dưới mới là thứ giữ an toàn, và
 * `pillar-markdown.test.ts` chốt lại cả hai:
 *
 *   1. ESCAPE TRƯỚC, format sau (`fmt = inline(escape(s))`). Đảo thứ tự là thủng.
 *   2. Chỉ nhận link `/…` hoặc `https://…` — chặn `javascript:` và scheme khác.
 *
 * `script-src` của site vẫn còn `'unsafe-inline'` (xem next.config.ts) nên một
 * thẻ lọt ra là chạy thật, không phải chỉ hiện HTML rác.
 */
export function renderMarkdown(md: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  // Inline formatting — run on ALREADY-ESCAPED text. Chỉ cho phép link nội bộ
  // (/...) hoặc https:// (chặn javascript:/khác). Hỗ trợ [text](url) và **bold**.
  const inline = (s: string) =>
    s
      .replace(
        /\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g,
        '<a href="$2" class="text-gold underline underline-offset-2 hover:opacity-80">$1</a>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  const fmt = (s: string) => inline(escape(s));
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  const flushList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(`<h3 class="mt-8 font-heading text-xl font-semibold text-foreground">${fmt(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      flushList();
      out.push(`<h2 class="mt-10 font-heading text-2xl font-semibold text-foreground">${fmt(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      flushList();
      out.push(`<h2 class="mt-10 font-heading text-2xl font-semibold text-foreground">${fmt(line.slice(2))}</h2>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul class="mt-3 ml-5 list-disc space-y-1 text-foreground/85">');
        inList = true;
      }
      out.push(`<li>${fmt(line.replace(/^[-*]\s+/, ''))}</li>`);
    } else {
      flushList();
      out.push(`<p class="mt-4 leading-relaxed text-foreground/85">${fmt(line)}</p>`);
    }
  }
  flushList();
  return out.join('\n');
}
