// Convert an AI "luận giải sâu" markdown reading into clean PDF sections.
//
// The free-tool PDF template (worker pdf/tool-pdf.ts) renders a section's `text`
// as HTML-escaped plain text, so raw markdown (##, **, - …) would leak its
// markers into the PDF. This splits the reading on headings into sections,
// strips inline markdown, and normalises bullets so the AI interpretation —
// currently the richest content the tools produce, and currently DROPPED from
// the PDF — reads cleanly. Line breaks are preserved with `\n`; the template
// renders `text` with `white-space: pre-line`.

export interface AiReadingSection {
  heading: string;
  text: string;
}

function stripInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1') // italic *
    .replace(/__(.+?)__/g, '$1') // bold __
    .replace(/_(.+?)_/g, '$1') // italic _
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1') // links → text
    .trim();
}

/**
 * @param markdown        the AI reading (markdown string)
 * @param fallbackHeading heading for content that appears before any `##`
 * @param maxSections     safety cap (template also caps total sections)
 */
export function aiReadingToSections(
  markdown: string | null | undefined,
  fallbackHeading = 'Luận giải sâu (AI)',
  maxSections = 12,
): AiReadingSection[] {
  if (!markdown || !markdown.trim()) return [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections: AiReadingSection[] = [];
  let heading = fallbackHeading;
  let buf: string[] = [];

  const flush = () => {
    const text = buf.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (text) sections.push({ heading, text });
    buf = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const h = /^\s{0,3}(#{1,4})\s+(.+)$/.exec(line);
    if (h) {
      flush();
      heading = stripInline(h[2] ?? '').replace(/[:：]\s*$/, '') || fallbackHeading;
      continue;
    }
    const bullet = /^\s*[-*+]\s+(.+)$/.exec(line) ?? /^\s*\d+[.)]\s+(.+)$/.exec(line);
    if (bullet) {
      buf.push(`• ${stripInline(bullet[1] ?? '')}`);
      continue;
    }
    if (line.trim() === '') {
      buf.push(''); // keep paragraph breaks
      continue;
    }
    buf.push(stripInline(line));
  }
  flush();

  return sections.slice(0, maxSections);
}
