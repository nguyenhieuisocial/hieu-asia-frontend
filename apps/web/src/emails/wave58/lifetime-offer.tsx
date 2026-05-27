/**
 * Wave 58 Phase B — D+7 Lifetime offer email.
 *
 * Day 7: one week into the relationship. Frame Lifetime not as "expensive"
 * but as "cheaper than 2 years of monthly". Math is the anchor.
 *
 * 4,990,000 VND lifetime vs 199,000 VND/month × 24 months = 4,776,000 VND.
 * The break-even is ~25 months → lifetime wins from year 3 onward + locks
 * the user out of future price hikes.
 *
 * CTA: /pricing#lifetime (single CTA, no choice paralysis).
 */

import { Button, Section, Text } from '@react-email/components';
import {
  DripLayout,
  BRAND_GOLD,
  GoldDot,
  ItalicVerb,
  bodyTextStyle,
  ctaButtonStyle,
  ctaWrapStyle,
  h1Style,
  refundBadgeStyle,
  subtleNoteStyle,
} from './_layout';
import type { Wave58EmailProps } from './welcome';

export default function LifetimeOfferEmail({
  userName,
  unsubscribeUrl,
}: Wave58EmailProps) {
  return (
    <DripLayout
      preview="Lifetime 4.99tr — bằng giá 25 tháng Monthly"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section>
        <Text style={h1Style}>
          Phép tính <ItalicVerb>đơn giản</ItalicVerb>
          <GoldDot />
        </Text>
        <Text style={bodyTextStyle}>Chào {userName},</Text>
        <Text style={bodyTextStyle}>
          Nếu bạn dùng hieu.asia đều đặn hơn 2 năm, Lifetime gần như chắc chắn
          rẻ hơn Monthly. Đây là phép tính:
        </Text>

        <Text style={bodyTextStyle}>
          <span style={{ color: BRAND_GOLD, fontWeight: 600 }}>Monthly:</span>
          {' '}199.000đ × 24 tháng ={' '}
          <strong>4.776.000đ</strong>
          <br />
          <span style={{ color: BRAND_GOLD, fontWeight: 600 }}>Lifetime:</span>
          {' '}<strong>4.990.000đ</strong> — trả một lần, dùng mãi mãi
        </Text>

        <Text style={bodyTextStyle}>
          Từ tháng thứ 25 trở đi, Lifetime tiết kiệm cho bạn 199.000đ mỗi tháng
          — và <ItalicVerb>khoá luôn</ItalicVerb> giá hiện tại trước các đợt
          tăng giá tiếp theo (giá nền tảng đã tăng 2 lần kể từ Q1).
        </Text>

        <Text style={bodyTextStyle}>
          Bạn không cần quyết ngay. Nhưng nếu đã chắc rằng bạn sẽ còn quay lại
          xem lại đại vận, hỏi Hieu về quyết định lớn, đọc cho người thân —
          Lifetime hợp lý hơn.
        </Text>

        <Section style={ctaWrapStyle}>
          <Button href="https://hieu.asia/pricing#lifetime" style={ctaButtonStyle}>
            Xem gói Lifetime
          </Button>
        </Section>

        <Section style={{ margin: '12px 0 0', textAlign: 'center' }}>
          <span style={refundBadgeStyle}>14 ngày hoàn tiền</span>
        </Section>

        <Text style={subtleNoteStyle}>
          Bao gồm: tất cả tính năng Premium, không giới hạn lá số, hỗ trợ ưu
          tiên qua Zalo.
        </Text>
      </Section>
    </DripLayout>
  );
}
