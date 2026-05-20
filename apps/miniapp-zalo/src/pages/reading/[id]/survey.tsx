import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@hieu-asia/ui';
import { ZaloHeader } from '../../../components/zalo-header';
import { ZaloBottomCta } from '../../../components/zalo-bottom-cta';
import { apiClient } from '../../../lib/api-bridge';
import type { ConsentPayload, UserContext } from '@hieu-asia/types';

const QUESTIONS = [
  { id: 'q1', text: 'Khi cần ra quyết định lớn, bạn dựa vào điều gì?', options: ['Phân tích dữ liệu', 'Trực giác', 'Hỏi người tin cậy', 'Cả ba'] },
  { id: 'q2', text: 'Dưới áp lực cao, bạn thường:', options: ['Tăng tốc làm việc', 'Im lặng, suy nghĩ', 'Trao đổi với người khác', 'Trì hoãn'] },
  { id: 'q3', text: 'Trong đội nhóm, bạn thường đóng vai:', options: ['Người dẫn dắt', 'Người phân tích', 'Người kết nối', 'Người thực thi'] },
  { id: 'q4', text: 'Mối quan tâm lớn nhất hiện tại:', options: ['Sự nghiệp', 'Tài chính', 'Quan hệ', 'Sức khỏe'] },
  { id: 'q5', text: 'Bạn muốn báo cáo tập trung vào:', options: ['Định hướng 90 ngày', 'Điểm mạnh / điểm mù', 'Tài chính', 'Quan hệ'] },
];

function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function SurveyPage() {
  const navigate = useNavigate();
  const { id: readingId = '' } = useParams<{ id: string }>();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const done = QUESTIONS.every((q) => answers[q.id]);

  const onSubmit = async () => {
    setSubmitting(true);
    window.sessionStorage.setItem(`hieu.survey.${readingId}`, JSON.stringify(answers));

    const consent = readSession<ConsentPayload>('hieu.consent') ?? {
      accepted: true as const,
      accepted_at: new Date().toISOString(),
      version: 'v1.0',
      purposes: ['personalized_reading', 'mentor_chat'],
    };
    const birth = readSession<Partial<UserContext> & { display_name?: string }>(
      `hieu.birth.${readingId}`,
    );
    const upload = readSession<{ public_read_url: string; mock: boolean }>(
      `hieu.upload.${readingId}`,
    );
    const userId = window.sessionStorage.getItem('hieu.user_id') ?? `anon-${readingId}`;

    if (!birth || !upload || upload.mock || !upload.public_read_url) {
      navigate(`/reading/${readingId}/processing`);
      return;
    }
    try {
      const resp = await apiClient.createReading({
        user_id: userId,
        user_context: {
          birth_date: birth.birth_date ?? '',
          birth_place: birth.birth_place ?? null,
          gender: birth.gender ?? null,
          personality_raw: JSON.stringify(answers),
        },
        hand_image_url: upload.public_read_url,
        consent,
      });
      window.sessionStorage.setItem(`hieu.reading.${readingId}`, JSON.stringify(resp));
      navigate(`/reading/${readingId}/processing?session_id=${resp.session_id}`);
    } catch (err) {
      console.warn('[survey] createReading failed, mock continue:', err);
      navigate(`/reading/${readingId}/processing`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <ZaloHeader title="Khảo sát tính cách" step="Bước 3 / 4" backTo={`/reading/${readingId}/upload`} />
      <section className="space-y-4 px-4 pt-5">
        {QUESTIONS.map((q, i) => (
          <Card key={q.id}>
            <CardContent className="space-y-3 pt-5">
              <p className="text-sm font-medium text-cream">
                {i + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const active = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={
                        'w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ' +
                        (active
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/20 text-cream/80 hover:border-gold/40')
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <ZaloBottomCta onClick={onSubmit} disabled={!done} loading={submitting}>
        Gửi khảo sát
      </ZaloBottomCta>
    </main>
  );
}
