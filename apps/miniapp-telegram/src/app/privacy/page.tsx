'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { TgBackButton } from '@/components/tg-back-button';

const LAST_UPDATED = '21/05/2026';

export default function MiniappPrivacyPage() {
  return (
    <main className="min-h-screen px-4 pb-20 pt-3">
      <TgBackButton />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Chính sách bảo mật</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">
          Chính sách bảo mật dữ liệu cá nhân
        </h1>
        <p className="mt-2 text-xs text-cream/60">
          Cập nhật lần cuối: <span className="text-gold">{LAST_UPDATED}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cream/80">
          Chính sách này mô tả cách hieu.asia thu thập, lưu trữ và sử dụng dữ liệu cá nhân của bạn,
          tuân thủ <strong className="text-gold">Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu
          cá nhân.
        </p>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">1. Người thu thập dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-cream/85">
            <p>
              <strong>hieu.asia</strong> — nền tảng AI insight cá nhân hoá. Liên hệ:{' '}
              <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">2. Loại dữ liệu thu thập</CardTitle>
            <CardDescription>Chỉ thu thập dữ liệu cần thiết để tạo báo cáo.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-cream/85">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Họ tên, ngày — tháng — năm — giờ sinh, nơi sinh.</li>
              <li>Ảnh lòng bàn tay, ảnh chân dung (tùy chọn).</li>
              <li>Câu trả lời khảo sát MBTI + 3 câu bối cảnh nghề nghiệp.</li>
              <li>Telegram User ID khi đăng nhập qua bot.</li>
              <li>Lịch sử cuộc trò chuyện Mentor AI.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">3. Mục đích sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-cream/85">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tạo báo cáo phân tích cá nhân (Tử Vi + MBTI + tâm lý).</li>
              <li>Cải thiện AI prompts sau khi dữ liệu được ẩn danh hóa.</li>
              <li>
                <strong className="text-gold">KHÔNG bán dữ liệu cho bên thứ ba.</strong>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">4. Thời gian lưu trữ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-cream/85">
            <div className="rounded-md border border-jade/30 bg-jade/10 p-3">
              <p>
                <strong className="text-jade">Ảnh bàn tay & chân dung:</strong>{' '}
                <strong>TỰ ĐỘNG XÓA SAU 7 NGÀY</strong> kể từ khi xử lý xong.
              </p>
            </div>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Báo cáo + metadata: vô thời hạn (có thể yêu cầu xóa).</li>
              <li>Mentor chat: 90 ngày, tự xóa sau.</li>
              <li>Audit log: 12 tháng.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">5. Quyền của bạn</CardTitle>
            <CardDescription>Theo Nghị định 13/2023/NĐ-CP.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-cream/85">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Quyền truy cập, sao chép, chỉnh sửa, xóa dữ liệu.</li>
              <li>Quyền rút lại consent bất cứ lúc nào.</li>
              <li>Quyền phản đối xử lý dữ liệu cho mục đích huấn luyện.</li>
            </ul>
            <p className="mt-2">
              Email yêu cầu tới{' '}
              <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>{' '}
              — phản hồi trong 30 ngày.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">6. Bảo mật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-cream/85">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Mã hóa TLS in-transit, mã hóa at-rest.</li>
              <li>RBAC + audit log cho truy cập nội bộ.</li>
            </ul>
            <p className="mt-2 font-semibold">Sub-processors:</p>
            <p className="text-cream/75">
              Anthropic, OpenAI, Google, Cloudflare, Vercel, Supabase, SePay.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">7. Cookie & tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-cream/85">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Chỉ functional cookies (session, locale).</li>
              <li>
                <strong className="text-gold">KHÔNG ad cookies.</strong>
              </li>
              <li>Analytics ẩn danh: Cloudflare Web Analytics.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">8. Thay đổi chính sách</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-cream/85">
            <p>
              Cập nhật lần cuối: <span className="text-gold">{LAST_UPDATED}</span>. Thay đổi quan
              trọng sẽ được thông báo ít nhất 14 ngày trước.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-4 border-gold/30">
          <CardHeader>
            <CardTitle className="text-base">9. Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-cream/85">
            <p>
              Email:{' '}
              <a className="text-gold underline" href="mailto:privacy@hieu.asia">
                privacy@hieu.asia
              </a>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-cream/55">
          © {new Date().getFullYear()} hieu.asia · Premium AI insight platform
        </p>
      </div>
    </main>
  );
}
