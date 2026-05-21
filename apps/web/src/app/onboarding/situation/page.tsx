'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

const STORAGE_KEY = 'hieu:onboarding:v2';
const MAX_LEN = 500;

type StoredOnboarding = {
  topic?: string;
  situation?: string;
  consent?: { mbti: boolean; palm: boolean; mentor: boolean; training: boolean };
};

function readStored(): StoredOnboarding {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredOnboarding;
  } catch {
    return {};
  }
}

function writeStored(next: StoredOnboarding) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

const EXAMPLES = [
  'Tôi đang phân vân có nên nghỉ việc không. Đã làm ở công ty hiện tại 4 năm, có offer khác lương cao hơn 30% nhưng môi trường lạ.',
  'Tôi và chồng hay cãi nhau về chuyện tiền. Anh ấy muốn đầu tư cổ phiếu, tôi muốn để dành mua nhà. Không bên nào chịu nhường.',
];

export default function OnboardingSituationPage() {
  const router = useRouter();
  const [situation, setSituation] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (!stored.topic) {
      router.replace('/onboarding/topic');
      return;
    }
    if (stored.situation) setSituation(stored.situation);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <SiteNav />
        <main className="min-h-screen" />
        <SiteFooter />
      </div>
    );
  }

  const len = situation.length;
  const tooShort = len > 0 && len < 50;

  function handleContinue() {
    const stored = readStored();
    const trimmed = situation.trim();
    writeStored({ ...stored, situation: trimmed || undefined });
    router.push('/onboarding/consent');
  }

  function handleSkip() {
    router.push('/onboarding/consent');
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">Bước 2 / 4</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Bạn đang ở tình huống nào?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
            Mô tả ngắn (50–500 ký tự). Càng cụ thể, Mentor càng giúp đúng. Bạn có thể bỏ qua bước này.
          </p>

          <div className="mt-8">
            <Textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value.slice(0, MAX_LEN))}
              maxLength={MAX_LEN}
              rows={6}
              placeholder="Ví dụ: tôi đang phân vân giữa hai lựa chọn..."
              className="min-h-[160px] text-base leading-relaxed"
              aria-label="Mô tả tình huống của bạn"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={tooShort ? 'text-gold/80' : 'text-cream/55'}>
                {tooShort ? 'Cần ít nhất 50 ký tự để Mentor hiểu rõ.' : ' '}
              </span>
              <span className="font-mono text-cream/60">
                {len} / {MAX_LEN}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.28em] text-cream/55">Hoặc thử một ví dụ</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setSituation(ex)}
                  className="rounded-lg border border-gold/20 bg-ink/40 p-4 text-left text-sm leading-relaxed text-cream/75 transition-colors hover:border-gold/50 hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/onboarding/topic')}
              className="inline-flex items-center gap-2 rounded-md border border-gold/30 px-4 py-2 text-sm text-cream transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              ← Quay lại
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Tiếp tục →
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-cream/70 transition-colors hover:bg-gold/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Bỏ qua
            </button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
