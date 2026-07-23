'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@hieu-asia/ui';
import type { SurveyAnswers } from '@/lib/survey-schema';
import { apiClient } from '@/lib/api';
import { getOrCreateAnonUserId } from '@hieu-asia/supabase';
import { track } from '@/lib/analytics';
import { SiteNav } from '@/components/home/SiteNav';
import {
  CustomSurveyForm,
  type SurveyQuestion,
  type SurveyAnswerValue,
} from '@/components/reading/CustomSurveyForm';

interface ConsentDraft {
  accepted: true;
  accepted_at: string;
  version: string;
  purposes: string[];
}

interface UserContextDraft {
  birth_date: string;
  birth_place?: string | null;
  gender?: string | null;
  timezone?: string | null;
  current_job?: string | null;
  current_financial_status?: string | null;
  primary_concern?: string | null;
  personality_raw?: string | null;
}

/**
 * Wave 60.58 T2.2 — 12 questions migrated from SURVEY_SCHEMA (SurveyJS JSON)
 * to native SurveyQuestion[] format. Content preserved verbatim; only the
 * rendering layer changed. Question IDs match QUESTION_AXIS_MAP entries in
 * lib/survey-schema.ts so backend scorer continues to work.
 */
const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // Cụm 1 — Cách bạn ra quyết định
  {
    id: 'q_decision_speed',
    type: 'single',
    label: 'Khi đứng trước một quyết định quan trọng, bạn thường:',
    required: true,
    choices: [
      { value: 'quick_intuition', label: 'Quyết nhanh theo trực giác rồi điều chỉnh sau' },
      { value: 'weigh_options', label: 'Cân nhắc kỹ vài phương án trước khi chọn' },
      { value: 'need_data', label: 'Cần dữ liệu đầy đủ mới quyết' },
      { value: 'consult_trusted', label: 'Tham khảo người tin cậy rồi quyết' },
    ],
  },
  {
    id: 'q_decision_logic',
    type: 'scale',
    label: 'Bạn dựa vào lý trí hay cảm xúc khi quyết định?',
    min: 1,
    max: 5,
    minLabel: 'Hoàn toàn cảm xúc',
    maxLabel: 'Hoàn toàn lý trí',
    required: true,
  },
  {
    id: 'q_decision_risk',
    type: 'single',
    label: 'Khi cơ hội có rủi ro, bạn nghiêng về:',
    required: true,
    choices: [
      { value: 'jump_big', label: 'Thử ngay nếu lợi ích lớn' },
      { value: 'pilot_small', label: 'Thử nhỏ trước, mở rộng nếu được' },
      { value: 'wait_signal', label: 'Đợi tín hiệu rõ rồi vào' },
      { value: 'keep_stable', label: 'Ưu tiên giữ ổn định, bỏ qua' },
    ],
  },
  // Cụm 2 — Phản ứng dưới áp lực
  {
    id: 'q_pressure_energy',
    type: 'scale',
    label: 'Khi căng thẳng, bạn nạp năng lượng bằng:',
    min: 1,
    max: 5,
    minLabel: 'Ở một mình',
    maxLabel: 'Gặp người khác',
    required: true,
  },
  {
    id: 'q_pressure_response',
    type: 'single',
    label: 'Khi mọi thứ trật khỏi kế hoạch, phản ứng đầu tiên của bạn là:',
    required: true,
    choices: [
      { value: 'replan_now', label: 'Lập kế hoạch mới ngay lập tức' },
      { value: 'investigate', label: 'Tìm hiểu nguyên nhân trước khi hành động' },
      { value: 'pause_calm', label: 'Tạm dừng để bình tĩnh lại' },
      { value: 'work_harder', label: 'Tăng tốc làm việc để bù lại' },
    ],
  },
  {
    id: 'q_pressure_symptoms',
    type: 'multi',
    label: 'Khi áp lực kéo dài, bạn nhận ra ở mình (chọn nhiều):',
    required: false,
    choices: [
      { value: 'insomnia', label: 'Mất ngủ' },
      { value: 'eating', label: 'Ăn nhiều hoặc bỏ ăn' },
      { value: 'irritable', label: 'Cáu gắt với người xung quanh' },
      { value: 'procrastinate', label: 'Trì hoãn việc quan trọng' },
      { value: 'isolate', label: 'Tự cô lập' },
      { value: 'overwork', label: 'Tăng cường tập luyện / làm việc' },
    ],
  },
  // Cụm 3 — Giao tiếp với đội nhóm
  {
    id: 'q_team_style',
    type: 'scale',
    label: 'Trong nhóm, bạn thường là:',
    min: 1,
    max: 5,
    minLabel: 'Người lắng nghe',
    maxLabel: 'Người dẫn dắt',
    required: true,
  },
  {
    id: 'q_team_feedback',
    type: 'single',
    label: 'Khi cần đưa phản hồi tiêu cực cho cộng sự, bạn:',
    required: true,
    choices: [
      { value: 'direct', label: 'Nói thẳng, đi vào vấn đề' },
      { value: 'direct_face_saving', label: 'Nói thẳng nhưng giữ thể diện cho người nghe' },
      { value: 'indirect', label: 'Vòng vo để tránh tổn thương' },
      { value: 'avoid', label: 'Né tránh, hy vọng họ tự nhận ra' },
    ],
  },
  {
    id: 'q_team_conflict',
    type: 'single',
    label: 'Khi có xung đột, bạn thường:',
    required: true,
    choices: [
      { value: 'confront', label: 'Đối mặt và giải quyết ngay' },
      { value: 'listen_first', label: 'Lắng nghe các bên trước khi kết luận' },
      { value: 'compromise', label: 'Tìm giải pháp dung hoà' },
      { value: 'withdraw', label: 'Rút lui để giữ hoà khí' },
    ],
  },
  // Cụm 4 — Mối quan tâm hiện tại
  {
    id: 'q_concern_areas',
    type: 'multi',
    label: 'Bạn đang cần lời khuyên về (chọn nhiều):',
    required: true,
    choices: [
      { value: 'career', label: 'Sự nghiệp / hướng đi nghề nghiệp' },
      { value: 'finance', label: 'Tài chính / dòng tiền' },
      { value: 'startup', label: 'Khởi nghiệp / kinh doanh' },
      { value: 'people', label: 'Quản trị nhân sự' },
      { value: 'family', label: 'Quan hệ gia đình' },
      { value: 'love', label: 'Tình cảm / hôn nhân' },
      { value: 'mental_health', label: 'Sức khỏe tinh thần' },
      { value: 'self_growth', label: 'Hướng phát triển bản thân' },
    ],
  },
  {
    id: 'q_concern_current_situation',
    type: 'text',
    label: 'Tình huống cụ thể bạn đang đối mặt (1-2 câu, không bắt buộc):',
    required: false,
    maxLength: 500,
    placeholder: 'Ví dụ: Tôi đang phân vân giữa hai cơ hội nghề nghiệp…',
  },
  // Cụm 5 — Câu hỏi tự do
  {
    id: 'q_open_self_describe',
    type: 'text',
    label:
      'Nếu phải mô tả bản thân cho một người cố vấn chỉ trong 3-4 câu, bạn sẽ nói gì?',
    required: false,
    maxLength: 1200,
    placeholder: 'Ví dụ: Tôi là người hành động nhanh, đôi khi quá vội. Tôi đang…',
  },
];

function readSession<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function summarizePersonality(a: SurveyAnswers): string {
  return JSON.stringify(a, null, 2);
}

/**
 * Ranh giới Suspense cho `useSearchParams`.
 *
 * Trước 2026-07-21 next-intl đọc `cookies()` khi render nên MỌI trang bị đánh
 * dấu dynamic — Next không prerender trang này, và việc thiếu Suspense quanh
 * `useSearchParams` không bao giờ lộ. Khi locale được chốt tĩnh để site cache
 * được ở CDN, Next bắt đầu prerender và build fail tại đây. Bọc Suspense thay vì
 * ép trang dynamic — ép dynamic sẽ lại mất cache đúng như vấn đề đang sửa.
 */
export default function SurveyPage() {
  return (
    <React.Suspense fallback={null}>
      <SurveyPageInner />
    </React.Suspense>
  );
}

function SurveyPageInner() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const readingId = params.id;
  const uploadObject = search.get('upload_object');

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleComplete = React.useCallback(
    async (rawAnswers: Record<string, SurveyAnswerValue>) => {
      const answers = rawAnswers as SurveyAnswers;
      setSubmitting(true);
      setError(null);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          `hieu.survey.${readingId}`,
          JSON.stringify(answers),
        );
      }

      track('survey_completed', { reading_id: readingId, answer_count: Object.keys(answers ?? {}).length });

      try {
        const consent = readSession<ConsentDraft>('hieu.consent') ?? {
          accepted: true as const,
          accepted_at: new Date().toISOString(),
          version: 'v1.0',
          purposes: ['personalized_reading', 'mentor_chat'],
        };
        const userContext = readSession<UserContextDraft>(`hieu.birth.${readingId}`);
        const upload = readSession<{ public_read_url: string; mock: boolean }>(
          `hieu.upload.${readingId}`,
        );
        // Canonical anon id lives in localStorage as `anon_<uuid>`
        // (getOrCreateAnonUserId). The old sessionStorage read always missed →
        // the reading was created under a malformed `anon-<readingId>` the
        // backend rejects, orphaning it from /account history + GDPR export.
        const userId = getOrCreateAnonUserId();

        if (!userContext || !upload || upload.mock) {
          // No backend / partial data — go straight to processing in mock mode.
          router.push(`/reading/${readingId}/processing`);
          return;
        }

        const resp = await apiClient.createReading({
          user_id: userId,
          user_context: {
            ...userContext,
            personality_raw: summarizePersonality(answers),
          },
          hand_image_url: upload.public_read_url,
          consent,
        });
        // Wave 60.77 — secondary metric for PostHog experiment 373562
        // (upsell banner). Mirrors the onboarding-form site so the survey
        // → palm flow also feeds the experiment.
        track('reading_session_created', {
          session_id: resp.session_id,
          source: 'survey',
        });
        window.sessionStorage.setItem(
          `hieu.reading.${readingId}`,
          JSON.stringify(resp),
        );
        router.push(`/reading/${readingId}/processing?session_id=${resp.session_id}`);
      } catch (e) {
        // Real session (userContext + non-mock upload present) — do NOT silently
        // fall back to mock processing, which would drop the session_id and
        // dead-end the reading. Surface the error so the user can retry.
        console.error('[survey] createReading failed:', e);
        setError(
          'Không thể tạo phiên đọc lá số. Vui lòng kiểm tra kết nối và bấm "Hoàn tất khảo sát" để thử lại.',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [readingId, router],
  );

  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink-radial pb-24 pt-20">
        <header className="container mx-auto max-w-3xl px-5">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              <Link href="/" className="hover:text-gold">Trang chủ</Link>
              <span className="mx-1.5">/</span>
              <Link href="/reading" className="hover:text-gold">Lá số</Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted-foreground">Khảo sát</span>
            </span>
            <span className="font-mono tracking-[0.12em] font-medium text-gold/80">Bước 3 / 3</span>
          </nav>
          <p className="font-mono text-[13px] tracking-[0.12em] font-medium text-gold/80">
            Khảo sát tính cách
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">12 câu hỏi</span>{' '}
            ngắn về cách bạn quyết định
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Để hệ thống hiểu cách bạn phản ứng, giao tiếp và đưa ra quyết định.
            Mất khoảng 2 phút — không có đáp án đúng/sai.
          </p>
          {uploadObject && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Ảnh đã tải lên: {uploadObject.split('/').pop()}
            </p>
          )}
        </header>

        <section className="container mx-auto mt-8 max-w-3xl px-5">
          <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <CustomSurveyForm
                questions={SURVEY_QUESTIONS}
                onSubmit={handleComplete}
                submitLabel="Hoàn tất khảo sát"
              />
            </CardContent>
          </Card>

          {submitting && (
            <p className="mt-4 text-center text-sm text-muted-foreground" role="status">
              Đang gửi khảo sát…
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-200"
            >
              {error}
            </p>
          )}
        </section>
      </main>
    </>
  );
}
