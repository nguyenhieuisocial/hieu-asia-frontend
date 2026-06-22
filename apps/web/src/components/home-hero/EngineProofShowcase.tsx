import * as React from 'react';
import { LaSoSvg } from '@/components/la-so-svg';
import { InfographicBatTu } from '@/components/learn/InfographicBatTu';

/**
 * EngineProofShowcase — "show the real engine output" giữa trang chủ.
 *
 * Wave 64 (founder review): dải giữa trang gần như toàn text trên nền kem
 * giống nhau, dù engine lá số đã render được hình thật. Section này đặt một
 * lá số Tử Vi 12 cung (LaSoSvg) + bảng Tứ Trụ Bát Tự ngũ hành (InfographicBatTu)
 * — cả hai vẽ từ DỮ LIỆU MẪU CỐ ĐỊNH, không cần user nhập, không gọi máy chủ —
 * vừa phá đơn điệu thị giác vừa CHỨNG MINH "tính thật, không tra bảng" (củng cố
 * định vị honesty). Nhãn persona-demo rõ ràng để không gây hiểu nhầm là dữ liệu
 * thật. Server component (LaSoSvg server-safe; InfographicBatTu là client nhưng
 * không state).
 */
export function EngineProofShowcase(): React.JSX.Element {
  return (
    <section aria-label="Ví dụ lá số được tính ra" className="bg-muted/20 py-12 sm:py-16">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <p className="font-mono text-editorial-mono uppercase tracking-[0.18em] text-muted-foreground">
          TÍNH THẬT, KHÔNG TRA BẢNG
        </p>
        <h2 className="mt-3 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
          Lá số được <em className="italic text-primary">tính ra</em>, không chép sẵn.
        </h2>
        <p className="mt-3 max-w-[36em] leading-relaxed text-muted-foreground">
          Từ ngày–giờ sinh, thuật toán dựng lá số Tử Vi 12 cung và Tứ Trụ Bát Tự —{' '}
          rồi AI mới đọc. Dưới đây là một ví dụ minh hoạ, không phải dữ liệu của bạn.
        </p>

        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          {/* Tử Vi · 12 cung — accent ochre kế thừa qua text-primary */}
          <figure className="flex flex-col items-center text-primary">
            <LaSoSvg className="w-full max-w-[280px]" />
            <figcaption className="mt-4 max-w-[28em] text-center text-sm text-muted-foreground">
              <span className="font-marketing-display text-foreground">Tử Vi · 12 cung</span> — bản đồ 12
              lĩnh vực đời sống (sơ đồ minh hoạ).
            </figcaption>
          </figure>

          {/* Bát Tự · 4 trụ ngũ hành — InfographicBatTu tự có caption + chú thích màu */}
          <figure className="flex flex-col items-center">
            <p className="mb-4 font-marketing-display text-base text-foreground">Bát Tự · 4 trụ ngũ hành</p>
            <InfographicBatTu />
          </figure>
        </div>

        <p className="mt-10 text-center font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
          Persona demo · không phải dữ liệu thật
        </p>
      </div>
    </section>
  );
}
