/**
 * /affiliate — Public landing page for the affiliate / referral program.
 *
 * Trust-first framing (brand "không bói mù"): the partner is a GUIDE sharing a
 * genuinely useful tool, not a salesperson. Single-tier, honest commission
 * (30% first order / 10% on renewals), radical payout transparency — the
 * deliberate inverse of the hidden-0%-floor pattern common to crypto-affiliate
 * programs. No income calculator (dream numbers), no fake leaderboard, no
 * multi-tier ("đa cấp") framing — single-tier keeps us inside Nghị định
 * 40/2018 without MLM registration.
 */

import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { PRICING, formatVND } from '@/lib/pricing';

export const metadata: Metadata = {
  title: { absolute: 'Cộng tác viên hieu.asia — kiếm hoa hồng & thu nhập' },
  description:
    'Giới thiệu hieu.asia cho người cần một góc nhìn về chính họ, nhận 30% hoa hồng đơn đầu + 10% các lần gia hạn. Minh bạch tuyệt đối, miễn phí, không đa cấp.',
  alternates: { canonical: 'https://hieu.asia/affiliate' },
  openGraph: {
    title: 'Cộng tác viên hieu.asia: biến niềm tin thành thu nhập',
    description:
      'Bạn dẫn đường, hieu.asia trả công xứng đáng. 30% đơn đầu + 10% gia hạn, trả tiền minh bạch, miễn phí tham gia.',
    url: 'https://hieu.asia/affiliate',
    type: 'website',
  },
};

const COMMISSION_FIRST = 0.3;
const COMMISSION_RENEWAL = 0.1;
const PREMIUM = PRICING.premium.vnd; // 99k one-time
const MONTHLY = PRICING.monthly.vnd; // 199k / tháng

const STEPS = [
  {
    step: '1',
    title: 'Đăng nhập & lấy link',
    body: 'Đăng nhập tài khoản hieu.asia, bấm một nút là có ngay link giới thiệu + mã QR riêng. Không cần xét duyệt, không cần đủ lượng người theo dõi.',
  },
  {
    step: '2',
    title: 'Chia sẻ với người cần',
    body: 'Gửi link cho người bạn nghĩ sẽ thấy hữu ích: bài đăng Facebook, story TikTok, nhóm Zalo, hay nhắn riêng. Bạn giới thiệu một công cụ thật, không bán giấc mơ.',
  },
  {
    step: '3',
    title: 'Nhận hoa hồng',
    body: 'Ai mua qua link của bạn, bạn được trả. Theo dõi đơn và số dư trong bảng điều khiển, rút về ngân hàng / MoMo / ZaloPay.',
  },
];

const TRUST_POINTS = [
  {
    title: '30% là 30%, ngay từ đơn đầu',
    body: 'Không có mức “khởi điểm 0%” ẩn, không có ngưỡng doanh số khổng lồ phải vượt mới được trả. Ngay đơn đầu tiên bạn đã nhận hoa hồng đầy đủ.',
  },
  {
    title: 'Điều kiện hiện ngay, không giấu trong chữ nhỏ',
    body: 'Cách tính, lúc nào được trả, trừ những gì: tất cả nói rõ trước khi bạn đăng ký. Đúng tinh thần “không bói mù” mà hieu.asia áp cho cả khách lẫn cộng tác viên.',
  },
  {
    title: 'Không thu hồi bất ngờ',
    body: 'Hoa hồng từ đơn thật đã xác nhận là của bạn. Chỉ khóa lại khi có gian lận (tự giới thiệu chính mình, đơn hoàn tiền), và điều đó cũng nói rõ trong điều khoản.',
  },
  {
    title: 'Một tầng, đúng luật',
    body: 'Bạn giới thiệu khách, bạn nhận tiền. Không “tuyến dưới”, không hoa hồng chồng tầng. Đơn giản, minh bạch, và nằm trong khuôn khổ Nghị định 40/2018.',
  },
];

const FAQ = [
  {
    q: 'Tôi cần bao nhiêu người theo dõi mới tham gia được?',
    a: 'Không cần ngưỡng nào cả. Một người bạn tin tưởng bạn về chuyện này đã đủ. Chương trình mở cho mọi tài khoản hieu.asia.',
  },
  {
    q: 'Hoa hồng tính thế nào?',
    a: '30% giá trị đơn đầu tiên của người bạn giới thiệu. Nếu họ dùng gói có gia hạn (theo tháng/năm), bạn nhận thêm 10% mỗi lần họ gia hạn. Tính trên số tiền thật khách trả, sau khi qua thời gian hoàn tiền.',
  },
  {
    q: 'Người tôi giới thiệu được ghi nhận trong bao lâu?',
    a: 'Khi ai đó bấm link của bạn, hệ thống ghi nhớ trong 30 ngày. Họ mua trong khoảng đó, kể cả khi quay lại ngày thứ 29, vẫn tính cho bạn. (Lưu ý: hiện người mua cần đăng nhập tài khoản để được ghi nhận.)',
  },
  {
    q: 'Khi nào và bằng cách nào tôi nhận tiền?',
    a: 'Bạn yêu cầu rút khi số dư khả dụng đủ ngưỡng. Tiền chuyển về ngân hàng / MoMo / ZaloPay bạn đã khai khi đăng ký. Lịch và ngưỡng cụ thể ghi trong điều khoản.',
  },
  {
    q: 'Có ràng buộc gì về nội dung không?',
    a: 'Không spam, không mạo danh hieu.asia, không hứa hẹn kiểu “bói trúng 100%”. Hãy giới thiệu chân thật. Với khán giả tâm linh, đó cũng là cách chuyển đổi tốt nhất. Vi phạm sẽ bị khóa tài khoản.',
  },
];

export default function AffiliateLandingPage() {
  // Honest, concrete example (real prices, no dream slider).
  const premiumCommission = PREMIUM * COMMISSION_FIRST; // ~30k
  const monthlyCommission = MONTHLY * COMMISSION_FIRST; // ~60k
  const monthlyRenewal = MONTHLY * COMMISSION_RENEWAL; // ~20k

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pt-16">
        {/* Hero — identity, not transaction */}
        <section className="relative overflow-hidden border-b border-border px-6 py-20 sm:py-28">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full bg-ink-radial opacity-80" />
          <div aria-hidden className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold-700">
              Chương trình giới thiệu · Hoa hồng minh bạch · Miễn phí tham gia
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Biến niềm tin mọi người đặt vào bạn thành <span className="text-gold-700">thu nhập</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/80">
              Khi bạn giới thiệu hieu.asia cho một người đang đi tìm câu trả lời về chính họ, bạn đang
              dẫn đường, và xứng đáng được trả công. <b className="text-gold-700">30%</b> hoa hồng đơn đầu,
              <b className="text-gold-700"> 10%</b> mỗi lần gia hạn. Sòng phẳng từ đồng đầu tiên.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-ink hover:bg-gold/90">
                <Link href="/affiliate/signup">Đăng nhập &amp; lấy link</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="border border-border">
                <Link href="/affiliate/dashboard">Vào bảng điều khiển</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Transparency — the differentiator */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-2xl font-bold">Vì sao cộng tác viên tin hieu.asia</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
              Nhiều chương trình treo con số lớn để câu người tham gia, rồi giấu điều kiện ở chỗ khó thấy.
              Chúng tôi làm ngược lại.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {TRUST_POINTS.map((p) => (
                <Card key={p.title} className="border-border bg-muted/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-gold-700">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-muted/5 px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-bold">Ba bước, không rườm rà</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <Card key={s.step} className="border-border bg-background">
                  <CardHeader>
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink">
                      {s.step}
                    </div>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Honest earnings example — real numbers, no dream calculator */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center text-2xl font-bold">Một ví dụ thật</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Không có máy “bấm ra số mơ”. Đây là con số thật theo bảng giá hiện tại.
            </p>
            <Card className="border-gold/30 bg-background">
              <CardContent className="space-y-4 pt-6 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="font-medium text-foreground">Bạn giới thiệu 1 người mua gói {PRICING.premium.label}</div>
                    <div className="text-muted-foreground">Đơn một lần {formatVND(PREMIUM)}</div>
                  </div>
                  <div className="whitespace-nowrap text-right">
                    <div className="text-xs uppercase text-muted-foreground">Bạn nhận</div>
                    <div className="text-lg font-bold text-gold-700">{formatVND(premiumCommission)}</div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-foreground">Bạn giới thiệu 1 người dùng gói {PRICING.monthly.label}</div>
                    <div className="text-muted-foreground">
                      {formatVND(MONTHLY)}/tháng. 30% tháng đầu, 10% mỗi tháng họ gia hạn
                    </div>
                  </div>
                  <div className="whitespace-nowrap text-right">
                    <div className="text-xs uppercase text-muted-foreground">Tháng đầu</div>
                    <div className="text-lg font-bold text-gold-700">{formatVND(monthlyCommission)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">rồi +{formatVND(monthlyRenewal)}/tháng</div>
                  </div>
                </div>
                <p className="pt-2 text-xs text-muted-foreground">
                  Giới thiệu được càng nhiều người thực sự cần, thu nhập càng cộng dồn. Con số ở trên là
                  hoa hồng trên một khách, không phải lời hứa thu nhập.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-muted/5 px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {FAQ.map((f, i) => (
                <Card key={i} className="border-border bg-background">
                  <CardHeader>
                    <CardTitle className="text-base">{f.q}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{f.a}</CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gold text-ink hover:bg-gold/90">
                <Link href="/affiliate/signup">Đăng nhập &amp; lấy link giới thiệu</Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Đọc đầy đủ{' '}
                <Link href="/affiliate/terms" className="text-gold-700 hover:underline">
                  điều khoản chương trình
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
