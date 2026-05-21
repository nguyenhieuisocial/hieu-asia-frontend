/**
 * TypographyShowcase — type scale + Vietnamese diacritic test.
 */

import * as React from 'react';

const VIETNAMESE_DIACRITICS = [
  'à á ả ã ạ',
  'ă ằ ắ ẳ ẵ ặ',
  'â ầ ấ ẩ ẫ ậ',
  'è é ẻ ẽ ẹ',
  'ê ề ế ể ễ ệ',
  'ì í ỉ ĩ ị',
  'ò ó ỏ õ ọ',
  'ô ồ ố ổ ỗ ộ',
  'ơ ờ ớ ở ỡ ợ',
  'ù ú ủ ũ ụ',
  'ư ừ ứ ử ữ ự',
  'ỳ ý ỷ ỹ ỵ',
  'đ Đ',
];

export function TypographyShowcase() {
  return (
    <div className="space-y-12">
      <section>
        <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Hierarchy</h4>
        <div className="mt-4 space-y-4">
          <Sample label="h1 / Display" meta="Outfit · 56px · bold · -2% tracking">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl md:text-6xl">
              Tự hiểu mình. Quyết định tốt hơn.
            </h1>
          </Sample>
          <Sample label="h2 / Section" meta="Outfit · 40px · semibold · -1% tracking">
            <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-cream sm:text-4xl">
              Tử Vi · MBTI · Palm Reading · AI Mentor
            </h2>
          </Sample>
          <Sample label="h3" meta="Outfit · 30px · semibold">
            <h3 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
              Báo cáo định hướng hành động, không định mệnh hóa
            </h3>
          </Sample>
          <Sample label="h4" meta="Outfit · 24px · semibold">
            <h4 className="font-heading text-xl font-semibold text-cream sm:text-2xl">
              Người bạn đồng hành huyền học hiện đại
            </h4>
          </Sample>
          <Sample label="h5" meta="Outfit · 20px · medium">
            <h5 className="font-heading text-lg font-medium text-cream sm:text-xl">
              Phân tích sâu, đồng cảm, có trách nhiệm
            </h5>
          </Sample>
          <Sample label="h6" meta="Outfit · 16px · medium · uppercase">
            <h6 className="font-heading text-base font-medium uppercase tracking-wider text-cream">
              Tử Vi Tử Bình
            </h6>
          </Sample>
        </div>
      </section>

      <section>
        <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Body</h4>
        <div className="mt-4 space-y-4">
          <Sample label="Lead / 18px" meta="Be Vietnam Pro · 18px · regular · 1.6 line-height">
            <p className="text-lg leading-relaxed text-cream/90">
              hieu.asia kết hợp Tử Vi cổ điển và AI hiện đại để đưa ra báo cáo cá
              nhân hoá. Mỗi báo cáo giải thích bằng ngôn ngữ đời thường, kèm
              hướng hành động cụ thể cho hôm nay.
            </p>
          </Sample>
          <Sample label="Body / 16px" meta="Be Vietnam Pro · 16px · regular">
            <p className="text-base leading-relaxed text-cream/80">
              Bạn sinh ngày bao nhiêu? Giờ sinh? Nhập một lần, hieu.asia tạo lá
              số Tử Vi đầy đủ — cung Mệnh, cung Tài, cung Phối — và đề xuất ba
              hành động ưu tiên dựa trên năng lượng năm nay.
            </p>
          </Sample>
          <Sample label="Small / 14px" meta="Be Vietnam Pro · 14px">
            <p className="text-sm leading-relaxed text-cream/70">
              Báo cáo không thay thế tư vấn tâm lý chuyên nghiệp. Mọi gợi ý
              mang tính tham khảo, người dùng tự chịu trách nhiệm quyết định.
            </p>
          </Sample>
          <Sample label="Caption / 12px" meta="Be Vietnam Pro · 12px · 1.5 line-height">
            <p className="text-xs leading-relaxed text-cream/60">
              Ảnh minh hoạ. Lá số thực được tạo từ dữ liệu cá nhân bạn cung cấp,
              lưu trữ mã hoá tại Cloudflare Asia-Pacific.
            </p>
          </Sample>
        </div>
      </section>

      <section>
        <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Mono</h4>
        <div className="mt-4 space-y-3">
          <Sample label="Mono code" meta="JetBrains Mono · 14px">
            <code className="block rounded-md border border-gold/15 bg-ink/80 px-4 py-3 font-mono text-sm text-gold">
              POST /api/reading {'{ "kind": "tu-vi", "birthDate": "1995-04-12" }'}
            </code>
          </Sample>
          <Sample label="Mono label" meta="JetBrains Mono · 11px · uppercase · 0.32em tracking">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold">
              Premium AI insight
            </span>
          </Sample>
        </div>
      </section>

      <section>
        <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
          Vietnamese diacritic test
        </h4>
        <p className="mt-2 text-sm text-cream/60">
          Kiểm tra toàn bộ tổ hợp dấu tiếng Việt — không ký tự nào bị mất hoặc
          render lệch baseline.
        </p>
        <div className="mt-4 rounded-lg border border-gold/15 bg-ink/40 p-6">
          <div className="space-y-1.5 font-sans text-base text-cream/90">
            {VIETNAMESE_DIACRITICS.map((row) => (
              <p key={row} className="leading-relaxed tracking-wide">
                {row}
              </p>
            ))}
          </div>
          <hr className="my-4 border-gold/15" />
          <p className="font-heading text-2xl font-semibold text-cream">
            Ăn, Ấp, Ầu, Ẩm, Ậm — Tử Vi, Hỷ Thần, Quý Nhân
          </p>
          <p className="mt-2 text-sm text-cream/70">
            Mọi tổ hợp dấu hiển thị đúng baseline. Font fallback: system-ui →
            Inter.
          </p>
        </div>
      </section>
    </div>
  );
}

function Sample({
  label,
  meta,
  children,
}: {
  label: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 rounded-lg border border-gold/10 bg-ink/30 p-5 md:grid-cols-[180px_1fr] md:items-baseline md:gap-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
          {label}
        </div>
        <div className="mt-1 text-[11px] text-cream/50">{meta}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
