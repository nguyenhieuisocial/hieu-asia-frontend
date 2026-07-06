/**
 * /affiliate/terms — Vietnam tax + Terms & Conditions for affiliates.
 * Static informational page. Public, no auth.
 */

import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { AffiliateSubNav } from '@/components/affiliate/AffiliateSubNav';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Điều khoản chương trình affiliate',
  description:
    'Điều khoản, quyền lợi, cơ cấu hoa hồng và nghĩa vụ thuế thu nhập cá nhân khi tham gia chương trình affiliate (tiếp thị liên kết) của hieu.asia.',
  alternates: { canonical: 'https://hieu.asia/affiliate/terms' },
  openGraph: {
    title: 'Điều khoản chương trình affiliate',
    description:
      'Cơ cấu hoa hồng minh bạch, một tầng, cookie 30 ngày, nghĩa vụ thuế VN và quy trình payout.',
    url: 'https://hieu.asia/affiliate/terms',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'eligibility',
    title: '1. Điều kiện tham gia',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5 text-foreground/80">
          <li>Cá nhân từ đủ 18 tuổi, công dân Việt Nam hoặc có thẻ tạm trú dài hạn.</li>
          <li>
            Có tài khoản ngân hàng / MoMo / ZaloPay đứng tên chính chủ trùng với email đăng ký.
          </li>
          <li>Không thuộc đối tượng bị hạn chế giao dịch theo pháp luật VN.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'commission',
    title: '2. Cơ cấu hoa hồng (một tầng)',
    body: (
      <>
        <p className="text-foreground/80">
          Hoa hồng được tính trên doanh thu thực thu (sau khi trừ refund &amp; chargeback) của khách hàng
          do bạn giới thiệu trong cửa sổ cookie 30 ngày.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/80">
          <li>30% hoa hồng trên đơn đầu tiên của khách bạn giới thiệu.</li>
          <li>10% cho mỗi lần khách gia hạn (gói theo tháng hoặc theo năm).</li>
          <li>
            Một tầng: chỉ người giới thiệu trực tiếp được hưởng, không có hoa hồng tuyến dưới.
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Đây là mức cố định, áp dụng cho mọi affiliate. Cấp Bronze / Silver / Gold / Platinum (nếu hiển
          thị trên dashboard) chỉ ghi nhận cột mốc số lượt giới thiệu, không làm thay đổi tỉ lệ hoa hồng.
        </p>
      </>
    ),
  },
  {
    id: 'tax',
    title: '3. Thuế thu nhập cá nhân (Việt Nam)',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5 text-foreground/80">
          <li>
            Theo Thông tư 111/2013/TT-BTC, hoa hồng môi giới &gt; 2.000.000đ / tháng phải khấu trừ thuế
            TNCN 10% tại nguồn.
          </li>
          <li>
            hieu.asia trừ 10% trên payout tiền mặt vượt ngưỡng và cung cấp bảng kê khấu trừ cho bạn.
            Chứng từ khấu trừ thuế điện tử chính thức (để hoàn thuế cuối năm) được phát hành qua đơn vị
            dịch vụ thuế được cấp phép khi có phát sinh chi trả thực tế.
          </li>
          <li>
            Tổng thu nhập &gt; 100.000.000đ / năm: bạn có trách nhiệm tự khai báo &amp; quyết toán bổ
            sung với Cục Thuế nơi cư trú.
          </li>
          <li>
            Payout &gt; 5.000.000đ / lần: bắt buộc cung cấp ảnh CMND/CCCD &amp; ảnh selfie để xác minh
            chủ tài khoản (KYC).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'payout',
    title: '4. Quy định payout',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5 text-foreground/80">
          <li>Số dư tối thiểu để rút: 500.000đ.</li>
          <li>Thời gian xử lý: 7 – 30 ngày làm việc tuỳ phương thức thanh toán (gồm khâu duyệt và chuyển tiền).</li>
          <li>Phí giao dịch (nếu có) khách hàng cuối tự chịu — bạn nhận trọn số tiền đã yêu cầu.</li>
          <li>
            Refund / chargeback trong 30 ngày kể từ giao dịch sẽ trừ hoa hồng tương ứng từ số dư khả
            dụng kế tiếp.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'fraud',
    title: '5. Hành vi gian lận — cấm tuyệt đối',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5 text-foreground/80">
          <li>Self-referral: đăng ký mua hàng qua chính link của mình.</li>
          <li>Bot / click farm: gửi traffic giả từ cùng IP, cùng device.</li>
          <li>Mạo danh hieu.asia, run ads brand-bidding trên tên hieu.asia.</li>
          <li>Spam: tin nhắn rác Zalo, group Facebook, gửi mass email.</li>
          <li>Nội dung sai sự thật, cam kết &quot;chính xác 100%&quot; về kết quả AI.</li>
        </ul>
        <p className="mt-3 text-foreground/80">
          Vi phạm bị flag tự động — admin review trong 48h. Sau review: ban vĩnh viễn + khoá toàn bộ
          số dư chưa payout.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '6. Thay đổi điều khoản',
    body: (
      <p className="text-foreground/80">
        hieu.asia có quyền cập nhật cơ cấu hoa hồng, ngưỡng tier, hoặc danh sách hành vi cấm với
        thông báo trước 14 ngày qua email. Affiliate không đồng ý có thể yêu cầu payout toàn bộ số dư
        khả dụng trước thời điểm hiệu lực.
      </p>
    ),
  },
];

export default function AffiliateTermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Điều khoản</span>
          </nav>

          <AffiliateSubNav />

          <header>
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
              Affiliate · Terms
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Điều khoản chương trình{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                affiliate
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Cập nhật ngày 21/05/2026. Áp dụng cho mọi affiliate đăng ký từ
              ngày này trở đi; affiliate V1.4 được áp dụng song song điều khoản
              cũ trong 90 ngày chuyển tiếp.
            </p>
          </header>

          <nav
            aria-label="Mục lục"
            className="mt-8 rounded-xl border border-border bg-card/40 p-4 backdrop-blur-sm"
          >
            <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
              Mục lục
            </div>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/80">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a className="hover:text-gold" href={`#${s.id}`}>
                    {s.title.replace(/^\d+\.\s/, '')}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
                <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {s.title}
                </h2>
                <div className="text-sm leading-relaxed">{s.body}</div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-6 text-center text-sm">
            <Link href="/affiliate/signup" className="text-gold-700 hover:underline">
              Quay lại đăng ký affiliate →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
