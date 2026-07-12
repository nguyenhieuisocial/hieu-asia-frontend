import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Hiến chương §4.7: DepthTabs ≥ 5 khái niệm × đủ 3 tầng (ELI5 / ELI14 / Chuyên gia).
// Khoá bằng test để cụm /learn/mbti không tụt xuống dưới chuẩn khi ai đó sửa sau này.
const source = readFileSync(new URL('./_active-learning.tsx', import.meta.url), 'utf8');

// Cắt riêng thân MbtiDepth — nơi duy nhất đặt DepthTabs — để đếm cho chắc.
const depthBody = source.slice(
  source.indexOf('export function MbtiDepth'),
  source.indexOf('const RECALL_QUESTIONS'),
);

const countOf = (needle: string) => depthBody.split(needle).length - 1;

describe('MbtiDepth — DepthTabs đạt chuẩn hiến chương §4.7', () => {
  it('có ≥ 5 khái niệm DepthTabs', () => {
    expect(countOf('concept=')).toBeGreaterThanOrEqual(5);
  });

  it('mỗi khái niệm đủ 3 tầng độ sâu (ELI5 / ELI14 / Chuyên gia)', () => {
    const concepts = countOf('concept=');
    expect(countOf("id: 'eli5'")).toBe(concepts);
    expect(countOf("id: 'eli14'")).toBe(concepts);
    expect(countOf("id: 'expert'")).toBe(concepts);
    expect(countOf("label: 'Chuyên gia'")).toBe(concepts);
  });
});
