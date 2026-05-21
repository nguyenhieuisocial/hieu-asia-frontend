/**
 * /affiliate — Public landing page pitching the affiliate program.
 * Hoa hồng 30% tháng đầu / 10% recurring · Cookie 30 ngày · QR code riêng.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Slider } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

const COMMISSION_FIRST = 0.30;
const COMMISSION_RECURRING = 0.10;
const AVG_ORDER_VND = 199_000;

function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export default function AffiliateLandingPage() {
  const [conversions, setConversions] = React.useState(20);
  const monthlyFirst = conversions * AVG_ORDER_VND * COMMISSION_FIRST;
  const recurring = conversions * AVG_ORDER_VND * COMMISSION_RECURRING * 6; // 6-month tail
  const yearTotal = monthlyFirst * 12 + recurring * 6;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cream/10 px-6 py-20 sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full bg-ink-radial opacity-80" />
        <div aria-hidden className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
            Chương trình affiliate — chưa từng có ở thị trường VN
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
            Kiếm tiền cùng <span className="text-gold">hieu.asia</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cream/80">
            Hoa hồng <b className="text-gold">30%</b> cho doanh thu tháng đầu, <b className="text-gold">10%</b> recurring 6 tháng tiếp.
            Cookie 30 ngày · QR code riêng · Dashboard real-time · Rút tiền từ 500.000đ.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/affiliate/signup">
              <Button size="lg" className="bg-gold text-ink hover:bg-gold/90">
                Đăng ký ngay
              </Button>
            </Link>
            <Link href="/affiliate/dashboard">
              <Button size="lg" variant="ghost" className="border border-cream/20">
                Đăng nhập affiliate
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold">Cách hoạt động</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Đăng ký',
                body: 'Nhận affiliate link và QR code chỉ trong 30 giây. Đăng ký nhanh, xét duyệt tự động. Khi rút tiền, bạn có thể cần xác minh thông tin nhận thanh toán theo quy định.',
              },
              {
                step: '2',
                title: 'Chia sẻ',
                body: 'Đăng link trên Facebook, TikTok, group Zalo, blog. QR code cho offline events / Telegram sticker.',
              },
              {
                step: '3',
                title: 'Nhận tiền',
                body: 'Theo dõi clicks / conversions real-time. Rút về bank / MoMo / ZaloPay khi đạt 500k.',
              },
            ].map((s) => (
              <Card key={s.step} className="border-cream/10 bg-cream/5">
                <CardHeader>
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink">
                    {s.step}
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-cream/70">{s.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="border-y border-cream/10 bg-cream/5 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-center text-2xl font-bold">Tính nhanh thu nhập</h2>
          <p className="mb-8 text-center text-sm text-cream/70">
            Trung bình mỗi đơn ~{formatVND(AVG_ORDER_VND)}. Trượt thanh để xem mức thu nhập tiềm năng.
          </p>
          <Card className="border-gold/30 bg-ink">
            <CardContent className="pt-6">
              <label className="mb-2 block text-sm">
                Số conversion / tháng: <span className="font-bold text-gold">{conversions}</span>
              </label>
              <Slider
                value={conversions}
                min={5}
                max={200}
                step={5}
                onChange={(e) => setConversions(Number(e.target.value))}
                className="mb-6"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs uppercase text-cream/60">Tháng đầu (30%)</div>
                  <div className="text-xl font-bold text-gold">{formatVND(monthlyFirst)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-cream/60">Recurring 6 tháng (10%)</div>
                  <div className="text-xl font-bold text-gold">{formatVND(recurring)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-cream/60">Tiềm năng cả năm</div>
                  <div className="text-xl font-bold text-gold">{formatVND(yearTotal)}</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-cream/70">
                * Ước tính. Thu nhập thực tế tùy thuộc retention và churn rate của khách bạn giới thiệu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Khi nào tôi được trả tiền?',
                a: 'Bạn có thể request payout bất cứ lúc nào khi số dư khả dụng ≥ 500.000đ. Admin duyệt trong 1–3 ngày làm việc, tiền về tài khoản trong 24h sau khi duyệt.',
              },
              {
                q: 'Cookie 30 ngày nghĩa là gì?',
                a: 'Khi khách click link/QR của bạn, hệ thống ghi nhớ trong 30 ngày. Bất kỳ giao dịch nào trong cửa sổ này đều được tính cho bạn — kể cả khách quay lại sau 29 ngày.',
              },
              {
                q: '"Recurring" tính như thế nào?',
                a: 'Khách đăng ký gói tháng/năm: bạn được 30% tháng đầu + 10% mỗi tháng tiếp theo trong 6 tháng. Tổng cộng bạn có thể nhận lên tới 90% LTV của khách.',
              },
              {
                q: 'Có ràng buộc nội dung không?',
                a: 'Không spam, không clickbait, không mạo danh hieu.asia. Vi phạm bị ban tài khoản + khóa số dư. Khuyến khích nội dung review chân thực.',
              },
              {
                q: 'Tôi cần KYC / đóng thuế không?',
                a: 'Payout dưới 2 triệu/tháng không cần KYC. Trên ngưỡng, chúng tôi xuất chứng từ thanh toán theo luật thuế VN (TNCN 10%).',
              },
            ].map((f, i) => (
              <Card key={i} className="border-cream/10">
                <CardHeader>
                  <CardTitle className="text-base">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-cream/70">{f.a}</CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/affiliate/signup">
              <Button size="lg" className="bg-gold text-ink hover:bg-gold/90">
                Bắt đầu kiếm tiền ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </div>
  );
}
