import { MentorSkeleton } from '@/components/skeletons/MentorSkeleton';

/**
 * Route-level loading fallback for the Mentor chat page.
 *
 * Next.js renders this during the segment's navigation/data wait. The
 * parent `[id]/loading.tsx` shows a report-shaped skeleton (tab strip +
 * content card); the chat layout is different, so we render the dedicated
 * MentorSkeleton here to match the shell that actually loads in and avoid
 * a layout jump.
 */
export default function MentorLoading() {
  return <MentorSkeleton />;
}
