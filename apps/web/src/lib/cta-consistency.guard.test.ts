// Guard: MỘT nhãn nút → MỘT đích đến.
//
// Vì sao cần: rà 30/07/2026 thấy nhãn "Lập lá số miễn phí" được dùng 19 chỗ
// nhưng dẫn tới 3 nơi khác nhau (/onboarding, /la-so-tu-vi, /la-so-bat-tu).
// Người dùng học "nút này làm gì" ở trang A rồi bấm nút y hệt ở trang B lại ra
// chỗ khác — một bên là công cụ tức thì, một bên là wizard 4 bước. Cùng đợt còn
// thấy 1 trang có 2 nút nghe giống nhau đi 2 nơi.
//
// KHÔNG ép mỗi đích chỉ có một nhãn — nhãn theo ngữ cảnh ("Lập lá số xem cung
// Quan của tôi") chuyển đổi tốt hơn nhãn chung, đó là chủ ý chứ không phải lỗi.
// Chỉ chặn chiều ngược lại: cùng chữ mà khác đích.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = join(process.cwd(), 'src');

/**
 * `/onboarding` (trang nêu dữ liệu sẽ xử lý) và `/onboarding/topic` (bước 1)
 * là HAI CỬA của CÙNG một wizard — khác nhau đúng một màn hình giới thiệu.
 * Trang trong khu tài khoản cho người đã đăng nhập vào thẳng bước 1 là hợp lý.
 * Coi chúng là một đích để guard không báo giả.
 */
const FUNNEL_ALIASES: readonly (readonly string[])[] = [['/onboarding', '/onboarding/topic']];

const canonical = (href: string): string => {
  const group = FUNNEL_ALIASES.find((g) => g.includes(href));
  return group?.[0] ?? href;
};

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules') tsxFiles(p, acc);
    } else if (e.name.endsWith('.tsx') && !/\.(test|stories)\.tsx$/.test(e.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const normalizeLabel = (raw: string): string =>
  raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')     // bỏ biểu thức JSX -> nhãn động thì bỏ qua
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[→←✦☯🔒🎁•·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Chỉ soi nhãn mang tính HÀNH ĐỘNG — bỏ qua link điều hướng/breadcrumb. */
const ACTION_WORDS = /(lập lá số|mở khoá|mở khóa|bắt đầu|dùng thử|xem thử)/;

const LINK_RE =
  /<(?:Link|a)\b[^>]*?href=(?:\{?['"`])(\/[^'"`\s{}]*)(?:['"`]\}?)[^>]*>([\s\S]{0,160}?)<\/(?:Link|a)>/g;

// Nhãn + href truyền qua object literal (tryCta={{...}}, mảng NavLink/FooterLink,
// registry entry...). Chính lớp này từng lọt lưới: tryCta của 3 trang learn hứa
// "công cụ tức thì" nhưng href trỏ wizard — guard bản đầu chỉ quét thẻ <Link>
// nên không thấy. Bắt cả hai thứ tự khoá trong cùng một object (không lồng {}).
const OBJ_HREF_LABEL_RE =
  /href:\s*['"`](\/[^'"`\s{}]*)['"`]\s*,[^{}]{0,160}?label:\s*['"`]([^'"`]{4,60})['"`]/g;
const OBJ_LABEL_HREF_RE =
  /label:\s*['"`]([^'"`]{4,60})['"`]\s*,[^{}]{0,160}?href:\s*['"`](\/[^'"`\s{}]*)['"`]/g;

interface Use { href: string; where: string }

function collect(): Map<string, Use[]> {
  const byLabel = new Map<string, Use[]>();
  for (const file of tsxFiles(SRC)) {
    const rel = relative(SRC, file).split(sep).join('/');
    const text = readFileSync(file, 'utf8');
    const record = (rawHref: string | undefined, rawLabel: string | undefined, index: number) => {
      if (!rawHref || !rawLabel) return;
      const label = normalizeLabel(rawLabel);
      if (label.length < 4 || label.length > 60) return;
      if (!ACTION_WORDS.test(label)) return;
      const href = canonical(rawHref.split('#')[0]!.split('?')[0]!.replace(/(.)\/$/, '$1'));
      const line = text.slice(0, index).split('\n').length;
      const list = byLabel.get(label) ?? [];
      list.push({ href, where: `${rel}:${line}` });
      byLabel.set(label, list);
    };
    let m: RegExpExecArray | null;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(text)) !== null) record(m[1], m[2], m.index);
    OBJ_HREF_LABEL_RE.lastIndex = 0;
    while ((m = OBJ_HREF_LABEL_RE.exec(text)) !== null) record(m[1], m[2], m.index);
    OBJ_LABEL_HREF_RE.lastIndex = 0;
    while ((m = OBJ_LABEL_HREF_RE.exec(text)) !== null) record(m[2], m[1], m.index);
  }
  return byLabel;
}

describe('CTA guard — một nhãn nút chỉ được có một đích', () => {
  it('không có nhãn hành động nào dẫn tới nhiều trang khác nhau', () => {
    const offenders: string[] = [];
    for (const [label, uses] of collect()) {
      const dests = [...new Set(uses.map((u) => u.href))];
      if (dests.length > 1) {
        const detail = dests
          .map((d) => `${d} (${uses.filter((u) => u.href === d).map((u) => u.where).join(', ')})`)
          .join('  ·  ');
        offenders.push(`"${label}" → ${detail}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
