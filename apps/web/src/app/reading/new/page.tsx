import { redirect } from 'next/navigation';

/**
 * Wave 60.58 T1.2 — Birth-data form was moved to `/onboarding/birth` so the
 * 4-step onboarding flow lives entirely under `/onboarding/*`. This route is
 * kept as a 308 permanent redirect for back-compat with old links from
 * `/learn/*`, `/reading`, sign-in `?next=` params, and external bookmarks.
 *
 * `redirect()` from `next/navigation` emits a 307/308 by default in the App
 * Router; query strings (`?method=tu-vi`, etc.) are not preserved — those
 * old links pointed at a flow that no longer differentiates by method on
 * this surface, so dropping the param is intentional.
 */
export const metadata = {
  title: 'Thông tin ngày sinh',
  robots: { index: false, follow: false },
};

export default function NewReadingPage() {
  redirect('/onboarding/birth');
}
