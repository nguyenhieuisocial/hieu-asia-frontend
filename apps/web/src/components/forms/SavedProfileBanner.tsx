'use client';

import * as React from 'react';
import { CheckCircle2, Edit3, X } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

import { useSavedProfile } from '@/hooks/use-saved-profile';
import { describeProfile, type SavedProfile } from '@/lib/saved-profile';

interface SavedProfileBannerProps {
  /** Called when user clicks "Dùng lại" — receives the saved profile to apply. */
  onUse?: (profile: SavedProfile) => void;
  /** Called when user clicks "Nhập lại" / "Sửa". Banner does not auto-clear storage. */
  onEdit?: () => void;
  className?: string;
}

export function SavedProfileBanner({
  onUse,
  onEdit,
  className,
}: SavedProfileBannerProps): React.JSX.Element | null {
  const { profile, isLoaded } = useSavedProfile();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isLoaded || !profile || dismissed) return null;
  const summary = describeProfile(profile);
  if (!summary) return null;

  return (
    <aside
      aria-label="Thông tin đã lưu"
      className={cn(
        'rounded-lg border border-jade/30 bg-jade/5 px-4 py-3 text-cream',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 sm:items-center">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-jade sm:mt-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-jade sm:text-base">
              Dùng thông tin đã lưu?
            </p>
            <p className="truncate text-sm text-cream/80 sm:text-base">{summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => onUse?.(profile)}
            className="rounded-md bg-jade px-3 py-1.5 text-sm font-medium text-bg hover:bg-jade/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade/60"
          >
            Dùng lại
          </button>
          <button
            type="button"
            onClick={() => onEdit?.()}
            className="inline-flex items-center gap-1 rounded-md border border-jade/30 px-3 py-1.5 text-sm text-cream hover:bg-jade/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade/40"
          >
            <Edit3 aria-hidden="true" className="h-3.5 w-3.5" />
            Nhập lại
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Đóng"
            className="rounded-md p-1.5 text-cream/60 hover:bg-jade/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade/40"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
