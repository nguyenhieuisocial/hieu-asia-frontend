import { describe, expect, it } from 'vitest';
import { requireText } from './llm';

describe('requireText — non-empty LLM output guard', () => {
  it('returns trimmed text when present', () => {
    expect(requireText({ text: '  bản đọc  ' }, 'synthesize')).toBe('bản đọc');
  });

  it('throws on empty string (content-filter / length-0 completion)', () => {
    expect(() => requireText({ text: '' }, 'synthesize')).toThrow(/reasoning_llm_empty: synthesize/);
  });

  it('throws on whitespace-only output', () => {
    expect(() => requireText({ text: '   \n\t ' }, 'analyze_palace.Mệnh')).toThrow(
      /reasoning_llm_empty: analyze_palace\.Mệnh/,
    );
  });

  it('throws on null / undefined text', () => {
    expect(() => requireText({ text: null }, 'x')).toThrow(/reasoning_llm_empty/);
    expect(() => requireText({}, 'x')).toThrow(/reasoning_llm_empty/);
  });
});
