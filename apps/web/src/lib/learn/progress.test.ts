/**
 * Kiểm thử các hàm THUẦN của lớp tiến độ /learn (progress.ts).
 * Wrapper localStorage không test ở đây (vitest env node, không có window).
 */
import { describe, it, expect } from 'vitest';
import {
  parseSummary,
  summaryFromChecklistRaw,
  stateOf,
  parseLastVisited,
  understandingKey,
  summaryKey,
} from './progress';

describe('keys', () => {
  it('đúng định dạng khóa (khớp khóa UnderstandingChecklist đã dùng từ trước)', () => {
    expect(understandingKey('bat-tu')).toBe('learn:understanding:bat-tu');
    expect(summaryKey('bat-tu')).toBe('learn:summary:bat-tu');
  });
});

describe('parseSummary', () => {
  it('JSON hợp lệ → object chuẩn hóa', () => {
    expect(parseSummary('{"done":3,"total":6,"ts":123}')).toEqual({ done: 3, total: 6, ts: 123 });
  });

  it('thiếu ts → ts 0; số lẻ → làm tròn xuống', () => {
    expect(parseSummary('{"done":2.9,"total":6}')).toEqual({ done: 2, total: 6, ts: 0 });
  });

  it('done > total (localStorage bị sửa tay) → kẹp về total, không hiện "8/6"', () => {
    expect(parseSummary('{"done":8,"total":6,"ts":1}')).toEqual({ done: 6, total: 6, ts: 1 });
    // total = 0 nghĩa là "không rõ tổng" (dữ liệu cũ) → không kẹp.
    expect(parseSummary('{"done":8,"total":0,"ts":1}')).toEqual({ done: 8, total: 0, ts: 1 });
  });

  it('sai kiểu / âm / NaN / garbage / null → null', () => {
    expect(parseSummary('{"done":"3","total":6}')).toBeNull();
    expect(parseSummary('{"done":-1,"total":6}')).toBeNull();
    expect(parseSummary('{"done":null,"total":6}')).toBeNull();
    expect(parseSummary('không phải json')).toBeNull();
    expect(parseSummary('[1,2]')).toBeNull();
    expect(parseSummary(null)).toBeNull();
  });
});

describe('summaryFromChecklistRaw (dữ liệu cũ)', () => {
  it('đếm đúng số true, total = 0 (không rõ tổng)', () => {
    expect(summaryFromChecklistRaw('{"a":true,"b":false,"c":true}')).toEqual({
      done: 2,
      total: 0,
      ts: 0,
    });
  });

  it('không có tick nào / rỗng / garbage → null', () => {
    expect(summaryFromChecklistRaw('{"a":false}')).toBeNull();
    expect(summaryFromChecklistRaw('{}')).toBeNull();
    expect(summaryFromChecklistRaw('[true]')).toBeNull();
    expect(summaryFromChecklistRaw('xxx')).toBeNull();
    expect(summaryFromChecklistRaw(null)).toBeNull();
  });
});

describe('stateOf', () => {
  it('null hoặc done=0 → none', () => {
    expect(stateOf(null)).toBe('none');
    expect(stateOf({ done: 0, total: 6, ts: 0 })).toBe('none');
  });

  it('0 < done < total → in-progress', () => {
    expect(stateOf({ done: 1, total: 6, ts: 0 })).toBe('in-progress');
    expect(stateOf({ done: 5, total: 6, ts: 0 })).toBe('in-progress');
  });

  it('done ≥ total > 0 → confident', () => {
    expect(stateOf({ done: 6, total: 6, ts: 0 })).toBe('confident');
  });

  it('dữ liệu cũ (total=0, done>0) → in-progress, không bao giờ confident', () => {
    expect(stateOf({ done: 4, total: 0, ts: 0 })).toBe('in-progress');
  });
});

describe('parseLastVisited', () => {
  it('hợp lệ → {slug, ts}', () => {
    expect(parseLastVisited('{"slug":"tu-vi","ts":9}')).toEqual({ slug: 'tu-vi', ts: 9 });
  });

  it('thiếu slug / rỗng / garbage → null', () => {
    expect(parseLastVisited('{"ts":9}')).toBeNull();
    expect(parseLastVisited('{"slug":""}')).toBeNull();
    expect(parseLastVisited('xxx')).toBeNull();
    expect(parseLastVisited(null)).toBeNull();
  });
});
