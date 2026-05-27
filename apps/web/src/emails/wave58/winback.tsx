/**
 * Wave 58 Phase B — D+14 Winback email.
 *
 * Day 14: last touch in the drip. User has had two weeks and hasn't upgraded
 * → they're either price-sensitive or busy. A 10% coupon makes the math even
 * clearer without devaluing the brand (one-time, time-boxed).
 *
 * Coupon code: WAVE58-WINBACK10 (managed in hieu_asia.coupons via Wave 27).
 * 7-day expiry creates urgency without manipulation.
 *
 * CTA: /pricing?coupon=WAVE58-WINBACK10
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

const COUPON_CODE = 'WAVE58-WINBACK10';

export default function WinbackEmail({
  userName,
  unsubscribeUrl,
}: Wave58EmailProps) {
  return (
    <DripLayout
      preview="Một ưu đãi 10% — dành riêng cho bạn, 7 ngày"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section>
        <Text style={h1Style}>
          Cảm ơn bạn đã <ItalicVerb>đồng hành</ItalicVerb>
          <GoldDot />
        </Text>
        <Text style={bodyTextStyle}>Chào {userName},</Text>
        <Text style={bodyTextStyle}>
          Hai tuần trước bạn đã thử bản đọc đầu tiên trên hieu.asia. Cảm ơn
          vì đã cho chúng tôi cơ hội.
        </Text>
        <Text style={bodyTextStyle}>
          Nếu bạn còn đang cân nhắc nâng cấp, đây là mã giảm 10% — chỉ gửi
          cho người đã đọc xong bản phân tích đầu tiên:
        </Text>

        <Section
          style={{
            backgroundColor: '#FBF6EA',
            border: `1px dashed ${BRAND_GOLD}`,
            borderRadius: '8px',
            margin: '20px 0',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              color: BRAND_GOLD,
              fontFamily: 'Menlo, Consolas, monospace',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            {COUPON_CODE}
          </Text>
          <Text
            style={{
              color: '#8A8275',
              fontSize: '12px',
              margin: '6px 0 0',
            }}
          >
            Hiệu lực 7 ngày · Áp dụng cho Premium và Monthly
          </Text>
        </Section>

        <Text style={bodyTextStyle}>
          Sau đó, đây là email cuối cùng trong chuỗi giới thiệu — chúng tôi
          sẽ không làm phiền bạn thêm trừ khi bạn quay lại.
        </Text>

        <Section style={ctaWrapStyle}>
          <Button
            href={`https://hieu.asia/pricing?coupon=${COUPON_CODE}`}
            style={ctaButtonStyle}
          >
            Dùng mã ngay
          </Button>
        </Section>

        <Section style={{ margin: '12px 0 0', textAlign: 'center' }}>
          <span style={refundBadgeStyle}>14 ngày hoàn tiền</span>
        </Section>

        <Text style={subtleNoteStyle}>
          Bạn vẫn có thể quay lại đọc bản miễn phí bất kỳ lúc nào — không bắt
          buộc nâng cấp.
        </Text>
      </Section>
    </DripLayout>
  );
}
