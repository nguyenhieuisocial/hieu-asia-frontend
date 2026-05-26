/**
 * Wave 58 Phase B — D+0 Welcome email.
 *
 * Trigger: agent_runs.status='completed' for a user's first reading. Sent ~5
 * min after completion (cron lag) so it arrives near the moment they would be
 * skimming results. Goal: re-anchor the reading and pull them back in.
 *
 * CTA: open the reading. No upsell here — Day 0 is trust, not selling.
 */

import { Button, Section, Text } from '@react-email/components';
import {
  DripLayout,
  GoldDot,
  ItalicVerb,
  bodyTextStyle,
  ctaButtonStyle,
  ctaWrapStyle,
  h1Style,
  subtleNoteStyle,
} from './_layout';

export interface Wave58EmailProps {
  /** User-facing display name (chart_data.full_name or Auth fallback). */
  userName: string;
  /** agent_runs.run_id — used for deep-link back into the reading. */
  runId: string;
  /** Snapshot of the reading subject (cây mệnh / mệnh chủ / năm sinh, etc.). */
  planSnapshot: string;
  /** Pre-built synthetic deep link to the reading page (relative-safe abs URL). */
  syntheticUrl: string;
  /** Signed unsubscribe URL (HMAC token). */
  unsubscribeUrl: string;
}

export default function WelcomeEmail({
  userName,
  runId,
  planSnapshot,
  syntheticUrl,
  unsubscribeUrl,
}: Wave58EmailProps) {
  return (
    <DripLayout
      preview={`${userName}, lá số của bạn đã sẵn sàng`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section>
        <Text style={h1Style}>
          Lá số của bạn đã <ItalicVerb>sẵn sàng</ItalicVerb>
          <GoldDot />
        </Text>
        <Text style={bodyTextStyle}>Chào {userName},</Text>
        <Text style={bodyTextStyle}>
          Cảm ơn bạn đã tin tưởng hieu.asia. Bản đọc{' '}
          <strong>{planSnapshot}</strong> vừa hoàn thành và đang chờ bạn{' '}
          <ItalicVerb>mở ra</ItalicVerb>.
        </Text>
        <Text style={bodyTextStyle}>
          Mỗi bản đọc là một góc nhìn — không phải lời tiên tri. Hãy đọc với
          tâm thế <ItalicVerb>quan sát</ItalicVerb>, rồi đối chiếu với điều
          bạn đã sống qua.
        </Text>

        <Section style={ctaWrapStyle}>
          <Button href={syntheticUrl} style={ctaButtonStyle}>
            Xem lá số
          </Button>
        </Section>

        <Text style={subtleNoteStyle}>
          Mã bản đọc: {runId.slice(0, 8)} · Nếu nút không bấm được, copy link:{' '}
          {syntheticUrl}
        </Text>
      </Section>
    </DripLayout>
  );
}
