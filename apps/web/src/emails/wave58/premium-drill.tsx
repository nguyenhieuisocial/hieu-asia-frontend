/**
 * Wave 58 Phase B — D+3 Premium feature drill email.
 *
 * Day 3: trust phase done, now show the actual differentiator. Two concrete
 * Premium features (PDF export + 30 mentor questions/day) instead of a generic
 * "upgrade" message — specifics convert better than promises.
 *
 * CTA: /pricing#premium (single-tier focus; lifetime push comes Day 7).
 */

import { Button, Section, Text } from '@react-email/components';
import {
  DripLayout,
  BRAND_AMBER,
  bodyTextStyle,
  ctaButtonStyle,
  ctaWrapStyle,
  h1Style,
  subtleNoteStyle,
} from './_layout';
import type { Wave58EmailProps } from './welcome';

export default function PremiumDrillEmail({
  userName,
  planSnapshot,
  unsubscribeUrl,
}: Wave58EmailProps) {
  return (
    <DripLayout
      preview="2 thứ Premium làm được mà bản miễn phí không"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section>
        <Text style={h1Style}>2 thứ Premium làm được</Text>
        <Text style={bodyTextStyle}>Chào {userName},</Text>
        <Text style={bodyTextStyle}>
          Bản đọc <strong>{planSnapshot}</strong> của bạn đã đầy đủ phần lõi.
          Premium chỉ thêm hai thứ — nhưng là hai thứ người dùng yêu cầu nhiều
          nhất:
        </Text>

        <Text style={bodyTextStyle}>
          <span style={{ color: BRAND_AMBER, fontWeight: 600 }}>1. Xuất PDF bản đọc.</span>
          <br />
          Cả lá số, lời luận giải, và biểu đồ — gói gọn trong một file để in,
          gửi cho người lớn trong nhà, hoặc lưu lại đọc khi không có mạng.
        </Text>

        <Text style={bodyTextStyle}>
          <span style={{ color: BRAND_AMBER, fontWeight: 600 }}>2. Mentor 30 câu/ngày.</span>
          <br />
          Bản miễn phí dừng sau vài câu. Premium cho bạn chat sâu — đào xuống
          từng cung, từng đại vận, từng năm cụ thể bạn đang quan tâm.
        </Text>

        <Section style={ctaWrapStyle}>
          <Button href="https://hieu.asia/pricing#premium" style={ctaButtonStyle}>
            Xem chi tiết Premium
          </Button>
        </Section>

        <Text style={subtleNoteStyle}>
          Không ràng buộc tháng — bạn mua một lần, dùng vĩnh viễn cho lá số
          hiện tại.
        </Text>
      </Section>
    </DripLayout>
  );
}
