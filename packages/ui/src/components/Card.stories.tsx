import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

/**
 * Wave 60.42 — Card primitives across light/dark themes.
 *
 * Card uses `bg-card/80` + `border-gold/15` which depend on the active CSS-var
 * theme (cream/100% white in light, ink 240 10% 9% in dark). Visual regression
 * here catches palette regressions whenever someone touches globals.css tokens.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Tử Vi 2026</CardTitle>
        <CardDescription>
          Phân tích cung mệnh và đại vận năm mới dựa trên ngày giờ sinh của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Báo cáo dày ~20 trang, kèm prompt và dữ liệu nguồn. Không hộp đen.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Xem báo cáo</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Bản đồ vận mệnh</CardTitle>
        <CardDescription>Tổng quan 12 cung theo lá số.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Mở rộng từng cung để xem chi tiết. Có thể xuất PDF khi cần.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Render light + dark side-by-side in a single snapshot so the diff surfaces
 * theme-specific palette regressions (e.g. border too dim in dark, bg too
 * washed in light).
 */
export const LightAndDarkSideBySide: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="grid grid-cols-2 gap-0 min-h-[400px]">
      <div className="flex items-center justify-center bg-[hsl(36_30%_92%)] p-6">
        <Card className="w-[280px]">
          <CardHeader>
            <CardTitle>Light theme</CardTitle>
            <CardDescription>Kem ngà nền sáng</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Card với border gold/15 trên nền sáng.</p>
          </CardContent>
        </Card>
      </div>
      <div className="dark flex items-center justify-center bg-[hsl(240_8%_6%)] p-6">
        <Card className="w-[280px]">
          <CardHeader>
            <CardTitle>Dark theme</CardTitle>
            <CardDescription>Đen than nền tối</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Card với border gold/15 trên nền tối.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
