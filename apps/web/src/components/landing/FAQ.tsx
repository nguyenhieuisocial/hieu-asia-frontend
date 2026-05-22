'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'AI có thực sự chính xác không?',
    a: (
      <>
        <p>
          hieu.asia tính toán lá số Tử Vi, Bát Tự bằng thuật toán thiên văn chính xác —
          phần &ldquo;cứng&rdquo; không phụ thuộc may rủi. Phần diễn giải dùng AI hiện đại
          được huấn luyện trên kho tàng kinh điển Á Đông kết hợp tâm lý học hành vi.
        </p>
        <p className="mt-2">
          Chúng tôi không hứa hẹn dự đoán tương lai. Mục tiêu là giúp bạn hiểu mẫu hình
          hành vi của mình rõ hơn để ra quyết định tốt hơn.
        </p>
      </>
    ),
  },
  {
    q: 'Dữ liệu cá nhân của tôi có an toàn?',
    a: (
      <>
        <p>
          Tất cả dữ liệu được mã hoá khi lưu trữ (AES-256 at rest), truyền tải qua TLS 1.3.
          Chúng tôi không bán dữ liệu cho bên thứ ba và không dùng dữ liệu của bạn để huấn
          luyện mô hình.
        </p>
        <p className="mt-2">
          Bạn có thể yêu cầu xoá toàn bộ tài khoản và dữ liệu liên quan bất cứ lúc nào trong
          phần Tài khoản.
        </p>
      </>
    ),
  },
  {
    q: 'Tôi có cần cung cấp ảnh lòng bàn tay không?',
    a: (
      <p>
        Không bắt buộc. Bạn vẫn nhận được báo cáo Tử Vi + Bát Tự + MBTI đầy đủ nếu không
        upload ảnh. Tuy nhiên, thêm Palm Reading sẽ giúp bức tranh tổng thể chi tiết hơn về
        khía cạnh cá tính và xu hướng hành động.
      </p>
    ),
  },
  {
    q: 'Chi phí như thế nào?',
    a: (
      <p>
        Khảo sát đầu vào miễn phí. Gói Standard 99.000đ một lần (1 lá số đầy đủ + PDF +
        3 câu hỏi Mentor). Premium 199.000đ/tháng hoặc 1.990.000đ/năm (Mentor không giới
        hạn + đại vận/lưu niên + người thân). Lifetime 4.990.000đ một lần — dùng trọn đời.
      </p>
    ),
  },
  {
    q: 'Khác gì với app huyền học khác?',
    a: (
      <>
        <p>
          Ba điểm khác biệt: (1) Tính toán chính xác theo trường phái Bắc phái Tử Vi Đẩu Số
          114 sao thay vì lưu bảng tra cứu sẵn. (2) Mentor AI dùng Claude Opus — đối thoại
          sâu, có ngữ cảnh, không phải chatbot bot scripted. (3) Triết lý không định mệnh
          hóa: mọi diễn giải đều quy về hành động bạn có thể làm.
        </p>
      </>
    ),
  },
  {
    q: 'Tôi có thể dùng trên điện thoại?',
    a: (
      <p>
        Có. hieu.asia chạy mượt trên trình duyệt mobile (iOS Safari, Android Chrome) và đã
        được tối ưu cho màn hình nhỏ. Sắp tới chúng tôi sẽ ra mắt Telegram Mini App và ứng
        dụng native iOS / Android.
      </p>
    ),
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Câu hỏi thường gặp
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Mọi thứ bạn muốn <span className="bg-gold-gradient bg-clip-text text-transparent">hỏi trước</span>
          </h2>
        </div>

        <div
          className="mt-12 rounded-2xl border border-border px-6"
          style={{ backgroundColor: 'rgba(20, 20, 26, 0.4)' }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
