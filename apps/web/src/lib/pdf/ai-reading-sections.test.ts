import { describe, it, expect } from 'vitest';
import { aiReadingToSections } from './ai-reading-sections';

describe('aiReadingToSections', () => {
  it('returns [] for empty/missing input', () => {
    expect(aiReadingToSections(null)).toEqual([]);
    expect(aiReadingToSections('')).toEqual([]);
    expect(aiReadingToSections('   \n  ')).toEqual([]);
  });

  it('splits on ## headings into sections', () => {
    const md = `## Điểm mạnh\nBạn sáng tạo.\n\n## Điểm cần lưu ý\nDễ phân tâm.`;
    const out = aiReadingToSections(md);
    expect(out).toHaveLength(2);
    expect(out[0]!.heading).toBe('Điểm mạnh');
    expect(out[0]!.text).toContain('Bạn sáng tạo.');
    expect(out[1]!.heading).toBe('Điểm cần lưu ý');
  });

  it('uses the fallback heading for content before any heading', () => {
    const out = aiReadingToSections('Mở đầu không có tiêu đề.', 'Luận giải sâu (AI)');
    expect(out).toHaveLength(1);
    expect(out[0]!.heading).toBe('Luận giải sâu (AI)');
  });

  it('strips inline markdown markers (no ** or _ leak)', () => {
    const out = aiReadingToSections('## H\nĐây là **đậm** và _nghiêng_ và `code`.');
    expect(out[0]!.text).toBe('Đây là đậm và nghiêng và code.');
    expect(out[0]!.text).not.toContain('**');
    expect(out[0]!.text).not.toContain('`');
  });

  it('normalises bullets to • and keeps line breaks', () => {
    const md = `## Gợi ý\n- Làm A\n- Làm B\n1. Bước một`;
    const out = aiReadingToSections(md);
    expect(out[0]!.text).toContain('• Làm A');
    expect(out[0]!.text).toContain('• Làm B');
    expect(out[0]!.text).toContain('• Bước một');
    expect(out[0]!.text.split('\n').length).toBeGreaterThanOrEqual(3);
  });

  it('strips trailing colon from headings + drops link URLs', () => {
    const out = aiReadingToSections('## Tổng quan:\nXem [trang này](https://x.test).');
    expect(out[0]!.heading).toBe('Tổng quan');
    expect(out[0]!.text).toBe('Xem trang này.');
  });

  it('caps the number of sections', () => {
    const md = Array.from({ length: 30 }, (_, i) => `## H${i}\nnội dung ${i}`).join('\n');
    expect(aiReadingToSections(md, 'AI', 12)).toHaveLength(12);
  });
});
