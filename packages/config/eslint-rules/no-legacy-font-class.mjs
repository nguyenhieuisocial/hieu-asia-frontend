/**
 * Typography discipline ESLint rule — `no-legacy-font-class`.
 *
 * Bối cảnh: hai token font display từng cùng tồn tại — `font-marketing-display`
 * và `font-editorial-display`. Sau VN-FIX 2026-06-22, cả hai trỏ về ĐÚNG cùng
 * một stack (Newsreader → Be Vietnam Pro → Noto Serif SC Han → Georgia), nên
 * giữ hai tên cho một thứ chỉ tạo cảm giác "có 2 kiểu chữ" và làm mỗi trang
 * chọn một tên khác nhau. Token cũ đã bị gỡ khỏi `apps/web/tailwind.config.ts`.
 *
 * Vì Tailwind KHÔNG báo lỗi khi gặp class không tồn tại (nó lặng lẽ không sinh
 * CSS), viết lại `font-marketing-display` sẽ làm chữ rơi về font mặc định mà
 * không ai biết cho tới khi nhìn thấy trên production. Luật này biến lỗi im
 * lặng đó thành lỗi lint ngay lúc viết code.
 *
 * Phạm vi: mọi chuỗi (string literal + template literal) — bắt được cả
 * `className="font-marketing-display"`, `clsx('font-marketing-display')` và
 * chuỗi ghép động. Cố ý dùng biên từ (`\b`) để không bắt nhầm chuỗi con của
 * một class dài hơn.
 */

/** Token đã gỡ → token thay thế. Thêm dòng mới khi có token khác bị gỡ. */
const RETIRED_CLASSES = {
  'font-marketing-display': 'font-editorial-display',
};

const PATTERN = new RegExp(
  `\\b(${Object.keys(RETIRED_CLASSES).join('|')})\\b`,
  'g',
);

function findRetired(text) {
  if (typeof text !== 'string' || text.length === 0) return null;
  PATTERN.lastIndex = 0;
  const m = PATTERN.exec(text);
  return m ? m[1] : null;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow Tailwind font classes that were removed from the theme. Tailwind silently emits no CSS for an unknown class, so the text falls back to the default font with no build error.',
    },
    schema: [],
    messages: {
      retiredFontClass:
        'Class "{{retired}}" đã bị gỡ khỏi tailwind.config.ts — Tailwind sẽ không sinh CSS cho nó và chữ rơi về font mặc định. Dùng "{{replacement}}" (cùng stack font, không đổi hiển thị).',
    },
  },
  create(context) {
    function report(node, raw) {
      const retired = findRetired(raw);
      if (!retired) return;
      context.report({
        node,
        messageId: 'retiredFontClass',
        data: { retired, replacement: RETIRED_CLASSES[retired] },
      });
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') report(node, node.value);
      },
      TemplateElement(node) {
        report(node, node.value?.raw);
      },
    };
  },
};
