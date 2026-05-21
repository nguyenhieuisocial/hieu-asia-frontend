import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài khoản của bạn',
  description:
    'Quản lý tài khoản hieu.asia: xuất dữ liệu, xóa tài khoản theo Nghị định 13/2023/NĐ-CP.',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
