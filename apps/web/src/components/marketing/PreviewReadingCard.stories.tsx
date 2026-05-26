import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PreviewReadingCard } from './PreviewReadingCard';

/**
 * Wave 60.56 P2.2 — PreviewReadingCard snapshots for the /signin sell.
 *
 * Two stories cover the prop matrix:
 *   - Default: full chrome (cung + subtitle + star pills + author attribution)
 *   - MinimalNoStars: quote-only variant for secondary cung surfaces
 *
 * Decorator wraps the card in a `max-w-md` warm-dark frame so the card renders
 * on the same surface it will live in beside the sign-in form, rather than on
 * the default Storybook cream backdrop.
 */
const meta: Meta<typeof PreviewReadingCard> = {
  title: 'Marketing/PreviewReadingCard',
  component: PreviewReadingCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-warm-dark-50 p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PreviewReadingCard>;

export const Default: Story = {
  args: {
    cungName: 'Cung Mệnh',
    cungSubtitle: 'Tử Vi · Bản đồ sao thời điểm sinh',
    starList: ['Tử Vi', 'Thiên Tướng', 'Hữu Bật'],
    insightQuote:
      'Bạn có Mệnh Vô Chính Diệu — sao chính cung Mệnh trống, ưu thế ở khả năng tự định hình bản thân không bị áp đặt bởi định khuôn.',
    insightAuthor: 'Hệ thống Tử Vi · Đối chiếu 2026',
    ctaLabel: 'Tiếp tục đăng nhập để xem đầy đủ',
    ctaHref: '#signin-form',
  },
};

export const MinimalNoStars: Story = {
  args: {
    cungName: 'Cung Phụ Mẫu',
    insightQuote:
      'Sao Thiên Cơ — bạn được hưởng phước từ trí tuệ gia đình; trách nhiệm là dùng cái biết đó để soi đường thế hệ sau.',
    ctaLabel: 'Đăng nhập để xem 12 cung',
    ctaHref: '#signin',
  },
};
