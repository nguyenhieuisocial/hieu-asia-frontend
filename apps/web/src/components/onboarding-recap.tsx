'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'hieu:onboarding:v2';

type ConsentState = {
  mbti: boolean;
  palm: boolean;
  mentor: boolean;
  training: boolean;
};

type StoredOnboarding = {
  topic?: string;
  situation?: string;
  consent?: ConsentState;
};

const TOPIC_LABELS: Record<string, string> = {
  career: 'Sự nghiệp',
  love: 'Tình cảm',
  finance: 'Tiền bạc',
  family: 'Gia đình',
  self: 'Định hướng bản thân',
  decision: 'Một quyết định cụ thể',
};

const CONSENT_LABELS: Record<keyof ConsentState, string> = {
  mbti: 'MBTI',
  palm: 'Palm',
  mentor: 'Mentor',
  training: 'Cải thiện sản phẩm',
};

function readStored(): StoredOnboarding | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOnboarding;
    if (!parsed || typeof parsed !== 'object') return null;
    // Treat empty objects as "no pre-step data"
    if (!parsed.topic && !parsed.situation && !parsed.consent) return null;
    return parsed;
  } catch {
    return null;
  }
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + '…';
}

export function OnboardingRecap() {
  const [data, setData] = useState<StoredOnboarding | null>(null);

  useEffect(() => {
    setData(readStored());
  }, []);

  if (!data) return null;

  const topicLabel = data.topic ? TOPIC_LABELS[data.topic] ?? data.topic : null;

  const consentKeys = data.consent
    ? (Object.keys(data.consent) as (keyof ConsentState)[]).filter((k) => data.consent?.[k])
    : [];
  const totalConsentSlots = 4; // mbti, palm, mentor, training
  const consentSummary =
    consentKeys.length === 0
      ? 'chưa chọn dữ liệu phụ'
      : `${consentKeys.map((k) => CONSENT_LABELS[k]).join(', ')} (${consentKeys.length}/${totalConsentSlots})`;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-lg border border-gold/20 bg-card/40 p-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-gold/80">
          Bạn đã chọn:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          {topicLabel && (
            <li>
              <span className="text-muted-foreground">Chủ đề:</span>{' '}
              <span className="text-foreground">{topicLabel}</span>
            </li>
          )}
          {data.situation && (
            <li>
              <span className="text-muted-foreground">Tình huống:</span>{' '}
              <span className="text-foreground">"{truncate(data.situation, 150)}"</span>
            </li>
          )}
          <li>
            <span className="text-muted-foreground">Đồng ý:</span>{' '}
            <span className="text-foreground">{consentSummary}</span>
          </li>
        </ul>
        <Link
          href="/onboarding/topic"
          className="mt-3 inline-block text-xs text-gold underline underline-offset-4 hover:opacity-80"
        >
          Sửa lại pre-step
        </Link>
      </div>

      <div className="rounded-md border border-jade-50/30 bg-jade/5 p-3 text-xs leading-relaxed text-foreground/75">
        Bạn đã đồng ý xử lý ngày giờ sinh ở bước trước; phần này bổ sung các quyền chi tiết hơn.
      </div>
    </div>
  );
}

export function OnboardingStepBadge() {
  const [hasPreStep, setHasPreStep] = useState(false);

  useEffect(() => {
    setHasPreStep(readStored() !== null);
  }, []);

  return (
    <span className="font-mono font-medium tracking-[0.12em] text-gold/80">
      {hasPreStep ? 'Bước 4 / 4 · Lập lá số' : 'Bước 1 / 4'}
    </span>
  );
}
