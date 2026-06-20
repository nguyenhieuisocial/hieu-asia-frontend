import { describe, expect, it } from 'vitest';
import { tryParseJson, formatBytes } from './json-tree-parse';

describe('tryParseJson', () => {
  it('parses objects and arrays into a tree-able value', () => {
    const obj = tryParseJson('{"a":1,"b":[2,3]}');
    expect(obj.ok).toBe(true);
    if (obj.ok) expect(obj.value).toEqual({ a: 1, b: [2, 3] });

    const arr = tryParseJson('[1,2,{"x":true}]');
    expect(arr.ok).toBe(true);
    if (arr.ok) expect(arr.value).toEqual([1, 2, { x: true }]);
  });

  it('rejects bare scalars even though they are valid JSON', () => {
    // A tree adds nothing over a scalar — keep the flat view.
    expect(tryParseJson('42').ok).toBe(false);
    expect(tryParseJson('"hi"').ok).toBe(false);
    expect(tryParseJson('true').ok).toBe(false);
    expect(tryParseJson('null').ok).toBe(false);
  });

  it('rejects non-JSON strings', () => {
    expect(tryParseJson('HA-12345').ok).toBe(false);
    expect(tryParseJson('not json {').ok).toBe(false);
    expect(tryParseJson('').ok).toBe(false);
  });

  it('tolerates surrounding whitespace', () => {
    expect(tryParseJson('  {"a":1}  ').ok).toBe(true);
  });
});

describe('formatBytes', () => {
  it('formats bytes under 1KB as B', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(812)).toBe('812 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('formats KB with one decimal under 10KB', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1638)).toBe('1.6 KB');
  });

  it('formats larger KB without decimals', () => {
    expect(formatBytes(20 * 1024)).toBe('20 KB');
  });

  it('formats MB', () => {
    expect(formatBytes(2.3 * 1024 * 1024)).toBe('2.3 MB');
  });

  it('handles invalid input', () => {
    expect(formatBytes(-1)).toBe('—');
    expect(formatBytes(NaN)).toBe('—');
  });
});
