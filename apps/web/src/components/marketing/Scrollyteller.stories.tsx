import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Scrollyteller } from './Scrollyteller';

/**
 * Wave 60.67 — Scrollyteller snapshots.
 *
 * Stories cover the chapter-count matrix + mobile viewport for sticky-vs-stack
 * verification.
 */
const meta: Meta<typeof Scrollyteller> = {
  title: 'Marketing/Scrollyteller',
  component: Scrollyteller,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Scrollyteller>;

const paragraph =
  'Lorem ipsum đoạn dài tiếng Việt để mô phỏng nội dung body chương. Engine deterministic lập lá số dựa trên ngày/giờ/nơi sinh. AI chỉ đọc structured chart và diễn giải bằng tiếng Việt, không tự tạo dữ kiện lá số. Người dùng luôn giữ quyền quyết định cuối cùng — đây là nền tảng triết lý của hieu.asia.';

const longBody = (
  <div className="space-y-6 font-sans text-base leading-relaxed text-cream-300">
    <p>{paragraph}</p>
    <p>{paragraph}</p>
    <p>{paragraph}</p>
  </div>
);

export const Default: Story = {
  args: {
    chapters: [
      {
        id: 'chapter-philosophy',
        eyebrow: 'CHƯƠNG 1 · TRIẾT LÝ',
        title: 'Bốn ống kính, một con người',
        content: longBody,
      },
      {
        id: 'chapter-limits',
        eyebrow: 'CHƯƠNG 2 · GIỚI HẠN',
        title: 'Cái AI biết & cái AI không thể biết',
        content: longBody,
      },
      {
        id: 'chapter-validation',
        eyebrow: 'CHƯƠNG 3 · KIỂM CHỨNG',
        title: 'Confidence không phải tin cậy',
        content: longBody,
      },
    ],
  },
};

export const FourChapters: Story = {
  args: {
    chapters: [
      ...(Default.args?.chapters ?? []),
      {
        id: 'chapter-process',
        eyebrow: 'CHƯƠNG 4 · CÁCH LÀM',
        title: 'Human-in-the-loop · Privacy-first',
        content: longBody,
      },
    ],
  },
};

export const FiveChapters: Story = {
  args: {
    chapters: [
      ...(FourChapters.args?.chapters ?? []),
      {
        id: 'chapter-rubric',
        eyebrow: 'CHƯƠNG 5 · CHẤT LƯỢNG',
        title: 'Rubric chất lượng + câu hỏi thường gặp',
        content: longBody,
      },
    ],
  },
};

export const MobileViewport: Story = {
  args: { ...FiveChapters.args },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
