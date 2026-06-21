/**
 * /legal — hub linking to Privacy, Terms, and the data-export / deletion
 * pointer at /account. Plain server component; no client JS needed.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, FileText, Download, Trash2, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Pháp lý',
  description:
    'Tổng hợp tài liệu pháp lý của hieu.asia: chính sách bảo mật, điều khoản, xuất và xoá dữ liệu cá nhân theo GDPR và Nghị định 13/2023.',
  alternates: { canonical: 'https://hieu.asia/legal' },
  // Hub mỏng trùng cột "Pháp lý" ở footer (đã trỏ thẳng Privacy/Terms). Để
  // noindex + bỏ khỏi sitemap (audit cấu trúc 2026-06-21) — dồn SEO về trang
  // Privacy/Terms thật; trang này chỉ là lối tắt tiện dụng.
  robots: { index: false, follow: true },
};

const SECTIONS = [
  {
    href: '/privacy',
    icon: Shield,
    title: 'Chính sách bảo mật',
    desc: 'Chúng tôi thu thập gì, lưu ở đâu, ai có thể đọc, và bạn kiểm soát thế nào.',
  },
  {
    href: '/terms',
    icon: FileText,
    title: 'Điều khoản sử dụng',
    desc: 'Quyền và nghĩa vụ khi dùng dịch vụ. Hoàn tiền 14 ngày. Không tự gia hạn ngầm.',
  },
  {
    href: '/account',
    icon: Download,
    title: 'Xuất dữ liệu cá nhân',
    desc: 'GDPR Điều 20 / Nghị định 13/2023 — tải JSON toàn bộ lá số, mentor sessions, settings.',
  },
  {
    href: '/account',
    icon: Trash2,
    title: 'Xoá dữ liệu vĩnh viễn',
    desc: 'Yêu cầu xoá tài khoản và toàn bộ dữ liệu cá nhân. Hành động này không thể hoàn tác.',
  },
] as const;

export default function LegalHubPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        <section className="relative isolate overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-700 sm:text-xs">
              Pháp lý
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Quyền của bạn,{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                rõ ràng và đầy đủ
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              hieu.asia tuân thủ GDPR và Nghị định 13/2023 về Bảo vệ dữ liệu cá
              nhân. Bạn có quyền xem, xuất, sửa và xoá dữ liệu của mình bất cứ
              lúc nào.
            </p>
          </div>
        </section>

        <section className="relative bg-background pb-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.title}
                    href={s.href}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-purple/20">
                      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading text-base font-semibold text-foreground">
                        {s.title}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-700 transition-colors group-hover:text-gold">
                        Mở
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-card/40 p-6 text-sm text-muted-foreground">
              <p className="font-heading text-base text-foreground">Liên hệ DPO</p>
              <p className="mt-2 leading-relaxed">
                Câu hỏi về dữ liệu cá nhân hoặc khiếu nại GDPR: gửi email tới{' '}
                <a href="mailto:privacy@hieu.asia" className="text-gold-700 hover:underline">
                  privacy@hieu.asia
                </a>
                . Chúng tôi cam kết trả lời trong 72 giờ làm việc.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
