import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowRight, Brain, Sparkles, Star } from 'lucide-react';
import { ProductTabs } from './ProductTabs';

/**
 * Wave 60.58 T1.3 — ProductTabs visual regression.
 *
 * Catches palette / spacing drift on the shared tab nav that replaces the
 * hand-rolled tablist + parallel mobile accordion on /reading/[id]/report
 * (and forthcoming /account in Wave 60.59). Three stories cover the canonical
 * shapes a consumer is likely to pass:
 *
 *   1. FourTabDefault   — full report shape (4 tabs, icon + label)
 *   2. TwoTabCompact    — minimal shape (2 tabs, no icons)
 *   3. WithBadge        — "MỚI" pill on an active tab
 *
 * Mobile viewport is covered in dedicated `*Mobile` stories so the accordion
 * branch (md:hidden) is exercised — chromatic only renders the visible branch
 * per viewport.
 */

const meta: Meta<typeof ProductTabs> = {
  title: 'Product/ProductTabs',
  component: ProductTabs,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ProductTabs>;

const SamplePanel = ({ children }: { children: React.ReactNode }) => (
  <article className="space-y-3 text-sm leading-relaxed text-cream-50/90">
    {children}
  </article>
);

const FOUR_TABS = [
  {
    id: 'overview',
    label: 'Tổng quan',
    icon: <Sparkles size={16} />,
    content: (
      <SamplePanel>
        <p>
          Tổng quan ngắn về báo cáo — phần đầu tiên người dùng đọc khi mở
          tab. Nội dung này thường là 2-3 đoạn paragraph.
        </p>
      </SamplePanel>
    ),
  },
  {
    id: 'tuvi',
    label: 'Tử Vi',
    icon: <Star size={16} />,
    content: (
      <SamplePanel>
        <p>Phân tích Tử Vi chi tiết — cung mệnh, thân, an sao.</p>
      </SamplePanel>
    ),
  },
  {
    id: 'insight',
    label: 'Phản chiếu',
    icon: <Brain size={16} />,
    content: (
      <SamplePanel>
        <p>Câu hỏi phản chiếu — gợi ý người dùng tự suy ngẫm.</p>
      </SamplePanel>
    ),
  },
  {
    id: 'next',
    label: 'Bước tiếp',
    icon: <ArrowRight size={16} />,
    content: (
      <SamplePanel>
        <p>Hành động cụ thể — checklist hoặc gợi ý kế tiếp.</p>
      </SamplePanel>
    ),
  },
];

export const FourTabDefault: Story = {
  args: { tabs: FOUR_TABS },
  render: (args) => (
    <div className="bg-warm-dark-50 p-8 text-cream-50">
      <ProductTabs {...args} />
    </div>
  ),
};

export const TwoTabCompact: Story = {
  args: {
    tabs: [
      {
        id: 'a',
        label: 'Phần A',
        content: (
          <SamplePanel>
            <p>Nội dung A — không icon, label đơn giản.</p>
          </SamplePanel>
        ),
      },
      {
        id: 'b',
        label: 'Phần B',
        content: (
          <SamplePanel>
            <p>Nội dung B.</p>
          </SamplePanel>
        ),
      },
    ],
  },
  render: (args) => (
    <div className="bg-warm-dark-50 p-8 text-cream-50">
      <ProductTabs {...args} />
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        label: 'Tổng quan',
        icon: <Sparkles size={16} />,
        content: (
          <SamplePanel>
            <p>Tab chuẩn không badge.</p>
          </SamplePanel>
        ),
      },
      {
        id: 'beta',
        label: 'Phản chiếu',
        icon: <Brain size={16} />,
        badge: 'MỚI',
        content: (
          <SamplePanel>
            <p>Tab có badge "MỚI" — pill bg-gold/20 text-gold.</p>
          </SamplePanel>
        ),
      },
    ],
  },
  render: (args) => (
    <div className="bg-warm-dark-50 p-8 text-cream-50">
      <ProductTabs {...args} />
    </div>
  ),
};

/**
 * Mobile viewport — exercises the `md:hidden` accordion branch. Default-open
 * item is the first tab; tap any header to expand/collapse (single-open).
 */
export const FourTabMobile: Story = {
  args: { tabs: FOUR_TABS },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div className="bg-warm-dark-50 p-4 text-cream-50">
      <ProductTabs {...args} />
    </div>
  ),
};
