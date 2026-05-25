'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useFeatureFlag, FLAGS } from '@/lib/feature-flags';
import { track } from '@/lib/analytics';

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

const DEFAULT_CONSENT: ConsentState = {
  mbti: false,
  palm: false,
  mentor: false,
  training: false,
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

type OptionalItem = {
  key: keyof ConsentState;
  label: string;
  hint: string;
};

const OPTIONAL_ITEMS: OptionalItem[] = [
  {
    key: 'mbti',
    label: 'Thêm MBTI để cá nhân hoá phân tích (khảo sát 1 phút)',
    hint: 'Mentor đối chiếu MBTI với lá số để chỉ ra điểm trùng và điểm lệch.',
  },
  {
    key: 'palm',
    label: 'Upload ảnh bàn tay để Palm Reading (ảnh tự xoá sau 7 ngày)',
    hint: 'Ảnh chỉ dùng để phân tích, không chia sẻ, mã hoá at-rest, xoá tự động sau 7 ngày.',
  },
  {
    key: 'mentor',
    label: 'Lưu chat Mentor để tiếp tục cuộc trò chuyện (90 ngày)',
    hint: 'Lịch sử chat lưu 90 ngày để bạn quay lại tiếp tục. Bạn có thể xoá bất kỳ lúc nào.',
  },
  {
    key: 'training',
    label: 'Cho phép dùng dữ liệu đã ẩn danh để cải thiện prompt (mặc định TẮT — bạn vẫn nhận được sản phẩm đầy đủ nếu để tắt)',
    hint: 'Không dùng dữ liệu cá nhân để huấn luyện mô hình. Chỉ dùng dữ liệu đã ẩn danh để cải thiện prompt — bạn có thể tắt tùy chọn này bất cứ lúc nào.',
  },
];

export default function OnboardingConsentPage() {
  const router = useRouter();
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [ready, setReady] = useState(false);

  // Wave 39 W-B — `onboarding_skip_optional` flag (targeted at users with
  // `persona=power_user`). When ON, pre-check all optional consent items and
  // auto-advance on first paint so power users don't get gated. Default OFF.
  const skipOptional = useFeatureFlag<boolean>(
    FLAGS.ONBOARDING_SKIP_OPTIONAL,
    false,
  );

  useEffect(() => {
    const stored = readStored();
    if (stored.consent) {
      setConsent({ ...DEFAULT_CONSENT, ...stored.consent });
    } else if (skipOptional) {
      // Power-user fast-path: all optional consents pre-checked.
      setConsent({ mbti: true, palm: true, mentor: true, training: false });
    }
    setReady(true);
  }, [skipOptional]);

  // Power-user fast-path: when the flag is ON and the user has no saved
  // consent yet, auto-advance to the next step. The pre-checked consent
  // state is still persisted via `handleContinue` so they keep control.
  useEffect(() => {
    if (!ready || !skipOptional) return;
    const stored = readStored();
    if (stored.consent) return; // user has been here before — don't auto-skip
    // Persist the auto-set consent and advance.
    writeStored({
      ...stored,
      consent: { mbti: true, palm: true, mentor: true, training: false },
    });
    // Wave 42.2 — emit one `onboarding_step_skipped` event per optional item
    // the flag bypassed so the funnel report can attribute drop-off / lift
    // to specific steps, not just the cohort. `training` is left FALSE even
    // on fast-path so it's reported as skipped-with-deny.
    for (const item of OPTIONAL_ITEMS) {
      track('onboarding_step_skipped', {
        step: `consent.${item.key}`,
        reason: 'flag:onboarding_skip_optional',
        auto_value: item.key === 'training' ? false : true,
      });
    }
    const target = stored.topic === 'decision' ? '/decisions/new' : '/reading/new';
    router.replace(target);
  }, [ready, skipOptional, router]);

  function toggle(key: keyof ConsentState) {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleContinue() {
    const stored = readStored();
    writeStored({ ...stored, consent });
    // Wave 30 W-D — was '/onboarding' which is the legacy consent page and
    // caused a double-consent loop. Route to the actual reading/decision flow.
    const target = stored.topic === 'decision' ? '/decisions/new' : '/reading/new';
    router.push(target);
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="min-h-screen" />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-6 pt-24 pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">Bước 3 / 4</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Bạn cho phép xử lý gì?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
            hieu.asia tách rõ dữ liệu bắt buộc và dữ liệu tuỳ chọn. Bạn có thể đổi lựa chọn bất kỳ lúc nào trong{' '}
            <Link href="/account" className="text-gold underline underline-offset-4 hover:opacity-80">
              Tài khoản
            </Link>
            . Chi tiết tại{' '}
            <Link href="/privacy" className="text-gold underline underline-offset-4 hover:opacity-80">
              Chính sách bảo mật
            </Link>
            .
          </p>

          <Card className="mt-8 border-jade-50/30 bg-card/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-jade-50">Bắt buộc</CardTitle>
              <CardDescription className="text-muted-foreground">
                Dữ liệu duy nhất bắt buộc để tạo lá số.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Checkbox id="consent-birth" checked disabled aria-label="Đồng ý xử lý ngày giờ sinh" />
                <div className="flex-1">
                  <Label htmlFor="consent-birth" className="text-sm text-foreground">
                    Đồng ý xử lý ngày giờ sinh để lập lá số (bắt buộc)
                  </Label>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Đây là dữ liệu duy nhất bắt buộc để tạo lá số. Bạn có thể xoá tài khoản + dữ liệu bất kỳ lúc nào.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-gold/20 bg-card/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Tuỳ chọn</CardTitle>
              <CardDescription className="text-muted-foreground">
                Bật để mở thêm tính năng. Mặc định tất cả đang tắt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-5">
                {OPTIONAL_ITEMS.map((item) => {
                  const id = `consent-${item.key}`;
                  return (
                    <li key={item.key} className="flex items-start gap-3">
                      <Checkbox
                        id={id}
                        checked={consent[item.key]}
                        onChange={() => toggle(item.key)}
                        aria-describedby={`${id}-hint`}
                      />
                      <div className="flex-1">
                        <Label htmlFor={id} className="text-sm text-foreground">
                          {item.label}
                        </Label>
                        <p id={`${id}-hint`} className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.hint}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/onboarding/situation')}
              className="inline-flex items-center gap-2 rounded-md border border-gold/30 px-4 py-2 text-sm text-foreground transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
