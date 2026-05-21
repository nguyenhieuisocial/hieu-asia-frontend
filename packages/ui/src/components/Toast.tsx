'use client';

/**
 * Toast notifications.
 *
 * Re-exports `sonner`'s imperative `toast` API so consumers can call:
 *
 *   import { toast } from '@hieu-asia/ui';
 *   toast.success('Đã lưu');
 *   toast.error('Có lỗi', { description: err.message });
 *
 * Mount the `<Toaster />` (see `./Toaster.tsx`) once at the app root.
 */
export { toast } from 'sonner';
export type { ExternalToast } from 'sonner';
