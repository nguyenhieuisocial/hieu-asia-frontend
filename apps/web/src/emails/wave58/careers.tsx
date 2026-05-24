/**
 * Wave 58 Phase B — D+1 Careers + Mentor upsell email.
 *
 * Day 1: user has had ~24h to digest the reading. Pull a thread that almost
 * everyone cares about — sự nghiệp — and pitch the Mentor chat as the way to
 * ask follow-up questions on it. Soft upsell, not a hard pricing push.
 *
 * CTA: open Mentor (which gates on plan, so free users hit upsell naturally).
 */

import { Button, Section, Text } from '@react-email/components';
import {
  DripLayout,
  bodyTextStyle,
  ctaButtonStyle,
  ctaWrapStyle,
  h1Style,
  subtleNoteStyle,
} from './_layout';
import type { Wave58EmailProps } from './welcome';

export default function CareersEmail({
  userName,
  planSnapshot,
  syntheticUrl,
  unsubscribeUrl,
}: Wave58EmailProps) {
  return (
    <DripLayout
      preview="Reading nói gì về sự nghiệp của bạn?"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section>
        <Text style={h1Style}>Reading nói gì về sự nghiệp?</Text>
        <Text style={bodyTextStyle}>Chào {userName},</Text>
        <Text style={bodyTextStyle}>
          Trong bản đọc <strong>{planSnapshot}</strong>, phần Quan-Tài Lộc-Mã
          thường gợi ý hướng nghề và thời điểm thuận lợi để chuyển hướng — nhưng
          một câu trả lời chung không thay được câu hỏi cụ thể của bạn.
        </Text>
        <Text style={bodyTextStyle}>
          Bạn có thể hỏi Mentor:
        </Text>
        <Text style={bodyTextStyle}>
          • &ldquo;Sự nghiệp của tôi giai đoạn 30-40 nên ưu tiên điều gì?&rdquo;
          <br />
          • &ldquo;Có dấu hiệu nào trong lá số cho biết khi nào nên chuyển công việc?&rdquo;
          <br />
          • &ldquo;Mệnh tôi hợp khởi nghiệp hay làm thuê dài hạn?&rdquo;
        </Text>
        <Text style={bodyTextStyle}>
          Mentor sẽ trả lời dựa trên lá số của bạn, không phải đoán mò.
        </Text>

        <Section style={ctaWrapStyle}>
          <Button href={syntheticUrl} style={ctaButtonStyle}>
            Mở Mentor
          </Button>
        </Section>

        <Text style={subtleNoteStyle}>
          Mentor là gợi ý — không phải định mệnh. Quyết định luôn là của bạn.
        </Text>
      </Section>
    </DripLayout>
  );
}
