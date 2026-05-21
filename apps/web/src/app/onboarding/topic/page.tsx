'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Heart, Wallet, Users, Compass, Crosshair, type LucideIcon } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

type TopicId = 'career' | 'love' | 'finance' | 'family' | 'self' | 'decision';

type Topic = {
  id: TopicId;
  title: string;
  hint: string;
  Icon: LucideIcon;
};

const TOPICS: Topic[] = [
  { id: 'career', title: 'Sự nghiệp', hint: 'Đổi việc, thăng tiến, định hướng', Icon: Briefcase },
  { id: 'love', title: 'Tình cảm', hint: 'Quan hệ, hôn nhân, gia đình', Icon: Heart },
  { id: 'finance', title: 'Tiền bạc', hint: 'Đầu tư, tiết kiệm, runway', Icon: Wallet },
  { id: 'family', title: 'Gia đình', hint: 'Cha mẹ, con cái, mối quan hệ', Icon: Users },
  { id: 'self', title: 'Định hướng bản thân', hint: 'Hiểu mình, giá trị, mục tiêu sống', Icon: Compass },
  { id: 'decision', title: 'Một quyết định cụ thể', hint: 'Tình huống đang phân vân', Icon: Crosshair },
];

const STORAGE_KEY = 'hieu:onboarding:v2';

type StoredOnboarding = {
  topic?: TopicId;
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

function isValidTopic(v: string | null): v is TopicId {
  return (
    v === 'career' ||
    v === 'love' ||
    v === 'finance' ||
    v === 'family' ||
    v === 'self' ||
    v === 'decision'
  );
}

function OnboardingTopicInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTopic = searchParams.get('topic');
  const [selected, setSelected] = useState<TopicId | null>(
    isValidTopic(queryTopic) ? queryTopic : null,
  );

  useEffect(() => {
    // URL > stored. If URL gave a valid topic, prefer it (and persist).
    if (isValidTopic(queryTopic)) {
      const stored = readStored();
      writeStored({ ...stored, topic: queryTopic });
      setSelected(queryTopic);
      return;
    }
    const stored = readStored();
    if (stored.topic) setSelected(stored.topic);
  }, [queryTopic]);

  function handleSelect(id: TopicId) {
    setSelected(id);
    const stored = readStored();
    writeStored({ ...stored, topic: id });
    router.push('/onboarding/situation');
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">Bước 1 / 4</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Hôm nay bạn muốn hiểu điều gì?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
            Chọn một chủ đề để hieu.asia bắt đầu đúng nơi bạn cần. Bạn luôn có thể đổi sau.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map(({ id, title, hint, Icon }) => {
              const isSelected = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  className={[
                    'group flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    isSelected
                      ? 'border-gold bg-gold/10'
                      : 'border-gold/20 bg-ink/40 hover:border-gold/50 hover:bg-gold/5',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <span
                    className={[
                      'inline-flex h-10 w-10 items-center justify-center rounded-lg border',
                      isSelected ? 'border-gold/60 bg-gold/15 text-gold' : 'border-gold/25 bg-ink/60 text-gold/80',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-lg font-semibold leading-tight text-cream">{title}</span>
                  <span className="text-xs leading-relaxed text-cream/65">{hint}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-cream/70 transition-colors hover:bg-gold/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Bỏ qua, đến lập lá số →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function OnboardingTopicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" aria-hidden="true" />}>
      <OnboardingTopicInner />
    </Suspense>
  );
}
