/**
 * Kiểm thử registry lộ trình học /learn (paths.ts).
 *
 * Ràng buộc cốt lõi: các lộ trình phủ ĐÚNG tập chủ đề trong LEARN_TOPICS,
 * mỗi chủ đề đúng MỘT lần (để "bài tiếp theo" đơn trị). Thêm/bớt chủ đề mà
 * quên cập nhật lộ trình → test này đỏ.
 */
import { describe, it, expect } from 'vitest';
import { LEARN_PATHS, pathForTopic } from './paths';
import { LEARN_TOPICS } from './related';

describe('LEARN_PATHS', () => {
  it('phủ đúng tập chủ đề của LEARN_TOPICS, mỗi chủ đề đúng 1 lần', () => {
    const pathSlugs = LEARN_PATHS.flatMap((p) => [...p.slugs]);
    const topicSlugs = LEARN_TOPICS.map((t) => t.slug);

    expect(new Set(pathSlugs).size).toBe(pathSlugs.length); // không trùng
    expect([...pathSlugs].sort()).toEqual([...topicSlugs].sort()); // đúng tập
  });

  it('mọi lộ trình có id/name/tagline không rỗng và ≥ 2 bài', () => {
    for (const p of LEARN_PATHS) {
      expect(p.id.trim().length).toBeGreaterThan(0);
      expect(p.name.trim().length).toBeGreaterThan(0);
      expect(p.tagline.trim().length).toBeGreaterThan(0);
      expect(p.slugs.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('pathForTopic', () => {
  it('trả đúng lộ trình + prev/next cho bài giữa', () => {
    const pos = pathForTopic('bat-tu');
    expect(pos).not.toBeNull();
    expect(pos!.path.id).toBe('dong-phuong-can-ban');
    expect(pos!.prevSlug).toBe('hop-tuoi');
    expect(pos!.nextSlug).toBe('tu-vi');
    expect(pos!.index).toBe(2);
  });

  it('bài đầu lộ trình có prev = null', () => {
    const pos = pathForTopic('mbti');
    expect(pos!.prevSlug).toBeNull();
    expect(pos!.nextSlug).toBe('big-five');
  });

  it('bài cuối lộ trình có next = null', () => {
    const pos = pathForTopic('can-xuong');
    // Lộ trình tướng học nay là palm → tuong-mat → can-xuong: bài tướng mặt xen
    // vào giữa vì nó cùng công cụ /xem-tuong với chỉ tay, nên đọc liền nhau.
    expect(pos!.prevSlug).toBe('tuong-mat');
    expect(pos!.nextSlug).toBeNull();
  });

  it('slug lạ → null', () => {
    expect(pathForTopic('khong-ton-tai')).toBeNull();
    expect(pathForTopic('')).toBeNull();
  });
});
