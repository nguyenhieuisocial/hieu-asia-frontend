import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt',
  description:
    'Quản lý thông báo, ngôn ngữ, giao diện, quyền riêng tư và liên kết Telegram cho tài khoản hieu.asia.',
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
