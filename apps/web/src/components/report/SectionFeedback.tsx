'use client';

import * as React from 'react';
import { Button, cn } from '@hieu-asia/ui';
import { ThumbsUp, ThumbsDown, Meh, MessageSquare } from 'lucide-react';

export type FeedbackRating = 'accurate' | 'partial' | 'inaccurate';
export type FeedbackAdjust = 'deeper' | 'practical' | 'softer' | 'examples';

export interface SectionFeedbackPayload {
  sectionId: string;
  rating: FeedbackRating;
  adjust?: FeedbackAdjust;
  comment?: string;
  submittedAt: string;
}

export interface SectionFeedbackProps {
  /** Unique per section. Used as the localStorage key suffix. */
  sectionId: string;
  /** Called after the payload is persisted to localStorage. */
  onSubmit?: (feedback: SectionFeedbackPayload) => void;
}

const STORAGE_PREFIX = 'hieu:feedback:';

const RATING_LABEL: Record<FeedbackRating, string> = {
  accurate: 'Rất đúng',
  partial: 'Một phần',
  inaccurate: 'Không đúng',
};

const ADJUST_LABEL: Record<FeedbackAdjust, string> = {
  deeper: 'Sâu hơn',
  practical: 'Thực tế hơn',
  softer: 'Nhẹ nhàng hơn',
  examples: 'Có ví dụ',
};

/**
 * Section 2.5 — feedback widget per report section.
 *
 * Stores rating + optional adjust/comment to localStorage under
 * `hieu:feedback:${sectionId}`. Does NOT send to any server (training-consent
 * split — only shared when the user explicitly forwards the report).
 */
export function SectionFeedback({ sectionId, onSubmit }: SectionFeedbackProps) {
  const storageKey = `${STORAGE_PREFIX}${sectionId}`;

  const [existing, setExisting] = React.useState<SectionFeedbackPayload | null>(
    null,
  );
  const [editing, setEditing] = React.useState(false);

  const [rating, setRating] = React.useState<FeedbackRating | null>(null);
  const [adjust, setAdjust] = React.useState<FeedbackAdjust | undefined>(
    undefined,
  );
  const [comment, setComment] = React.useState('');
  const [justSaved, setJustSaved] = React.useState(false);

  const commentId = React.useId();

  // Load saved feedback on mount.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SectionFeedbackPayload;
      if (parsed && typeof parsed.rating === 'string') {
        setExisting(parsed);
      }
    } catch {
      // Ignore corrupt entries.
    }
  }, [storageKey]);

  // Auto-clear the "saved" toast after 4s.
  React.useEffect(() => {
    if (!justSaved) return;
    const t = window.setTimeout(() => setJustSaved(false), 4000);
    return () => window.clearTimeout(t);
  }, [justSaved]);

  function handleRatingClick(next: FeedbackRating) {
    setRating(next);
  }

  function handleSubmit() {
    if (!rating) return;
    const payload: SectionFeedbackPayload = {
      sectionId,
      rating,
      submittedAt: new Date().toISOString(),
      ...(adjust ? { adjust } : {}),
      ...(comment.trim() ? { comment: comment.trim() } : {}),
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage may be full or disabled — still surface success state so the
      // user knows we processed the click.
    }
    setExisting(payload);
    setEditing(false);
    setJustSaved(true);
    setRating(null);
    setAdjust(undefined);
    setComment('');
    onSubmit?.(payload);
  }

  // Already-submitted compact view.
  if (existing && !editing) {
    return (
      <div
        className="rounded-lg border border-border bg-card/40 p-4 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-jade-500" aria-hidden="true">
            ✓
          </span>
          <span>
            Bạn đã đánh giá:{' '}
            <strong className="text-foreground">
              {RATING_LABEL[existing.rating]}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setRating(existing.rating);
              setAdjust(existing.adjust);
              setComment(existing.comment ?? '');
              setEditing(true);
            }}
            className="text-gold underline underline-offset-2 hover:opacity-80"
          >
            Sửa
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Feedback lưu trên máy của bạn để cải thiện trải nghiệm cá nhân. Chỉ
          chia sẻ tới hệ thống khi bạn xác nhận (chưa tự động gửi đi).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4 text-sm">
      {justSaved && (
        <div
          role="status"
          className="mb-3 rounded-md border border-jade-500/30 bg-jade-900/20 px-3 py-2 text-xs text-jade-50"
        >
          Cảm ơn — phản hồi đã lưu trên máy bạn. Bạn có thể chia sẻ kèm báo cáo
          nếu muốn.
        </div>
      )}

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Đoạn này có đúng với bạn không?
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <RatingButton
          active={rating === 'accurate'}
          onClick={() => handleRatingClick('accurate')}
          icon={<ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />}
          label={RATING_LABEL.accurate}
        />
        <RatingButton
          active={rating === 'partial'}
          onClick={() => handleRatingClick('partial')}
          icon={<Meh className="h-3.5 w-3.5" aria-hidden="true" />}
          label={RATING_LABEL.partial}
        />
        <RatingButton
          active={rating === 'inaccurate'}
          onClick={() => handleRatingClick('inaccurate')}
          icon={<ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />}
          label={RATING_LABEL.inaccurate}
        />
      </div>

      {rating !== null && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Bạn muốn điều chỉnh hướng nào?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(ADJUST_LABEL) as FeedbackAdjust[]).map((key) => (
                <AdjustChip
                  key={key}
                  active={adjust === key}
                  onClick={() =>
                    setAdjust((cur) => (cur === key ? undefined : key))
                  }
                  label={ADJUST_LABEL[key]}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor={commentId}
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              Ghi chú (không bắt buộc)
            </label>
            <textarea
              id={commentId}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full resize-none rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              placeholder="Phần nào bạn thấy lệch, hay muốn AI đi sâu hơn ở đâu?"
              maxLength={500}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!rating}>
              Gửi feedback
            </Button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setRating(null);
                  setAdjust(undefined);
                  setComment('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Hủy
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground">
        Feedback lưu trên máy của bạn để cải thiện trải nghiệm cá nhân. Chỉ
        chia sẻ tới hệ thống khi bạn xác nhận (chưa tự động gửi đi).
      </p>
    </div>
  );
}

interface RatingButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function RatingButton({ active, onClick, icon, label }: RatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-gold/60 bg-gold/15 text-gold'
          : 'border-border bg-card/60 text-foreground/80 hover:border-gold/30 hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface AdjustChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function AdjustChip({ active, onClick, label }: AdjustChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-xs transition-colors',
        active
          ? 'border-gold/60 bg-gold/15 text-gold'
          : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}
