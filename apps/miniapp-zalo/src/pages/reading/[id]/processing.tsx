import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@hieu-asia/ui';
import { ZaloHeader } from '../../../components/zalo-header';

const STEPS = [
  { key: 'prepare_context', label: 'Đang dựng dữ liệu nền…' },
  { key: 'vision', label: 'Đang phân tích ảnh bàn tay…' },
  { key: 'logic', label: 'Đang lập ma trận ngày sinh…' },
  { key: 'psychology', label: 'Đang đối chiếu tâm lý hành vi…' },
  { key: 'alignment', label: 'Đang đồng bộ Hội đồng Agent…' },
  { key: 'report', label: 'Đang biên tập Cẩm Nang Cuộc Đời…' },
];

/**
 * V1 mini app uses synthetic progression — Zalo CDN doesn't proxy socket.io.
 * Real-time updates will plug into a backend long-poll endpoint in Phase 2.
 */
export function ProcessingPage() {
  const navigate = useNavigate();
  const { id: readingId = '' } = useParams<{ id: string }>();
  const [search] = useSearchParams();
  const sessionId = search.get('session_id');
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= STEPS.length) {
        setActiveIdx(STEPS.length);
        window.setTimeout(() => navigate(`/reading/${readingId}/report`), 700);
        return;
      }
      setActiveIdx(i);
      timer = window.setTimeout(tick, 2800);
    };
    let timer = window.setTimeout(tick, 2800);
    return () => window.clearTimeout(timer);
  }, [navigate, readingId]);

  return (
    <main className="min-h-screen bg-ink-radial pb-10">
      <ZaloHeader title="Hội đồng Agent đang phân tích" step="Bước 4 / 4" backTo="/" />
      <section className="px-4 pt-5">
        <Card>
          <CardContent className="space-y-3 pt-6">
            {STEPS.map((s, i) => {
              const state = i < activeIdx ? 'done' : i === activeIdx ? 'running' : 'pending';
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span
                    className={
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ' +
                      (state === 'done'
                        ? 'border-jade bg-jade/20 text-jade'
                        : state === 'running'
                          ? 'animate-pulse border-gold bg-gold/20 text-gold'
                          : 'border-cream/15 text-cream/30')
                    }
                  >
                    {state === 'done' ? '✓' : i + 1}
                  </span>
                  <p
                    className={
                      'text-sm ' +
                      (state === 'pending' ? 'text-cream/40' : 'text-cream/90')
                    }
                  >
                    {s.label}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-cream/40">
          Khoảng 30 – 60 giây · giữ Mini App mở
        </p>
        {sessionId ? (
          <p className="mt-2 text-center font-mono text-[10px] text-cream/30">
            Session: {sessionId.slice(0, 8)}…
          </p>
        ) : null}
      </section>
    </main>
  );
}
