import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = { title: 'Đồng ý xử lý dữ liệu' };

export default function OnboardingPage() {
  return (
    <main className="container mx-auto max-w-2xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Đồng ý xử lý dữ liệu cá nhân</CardTitle>
          <CardDescription>
            Trước khi bắt đầu, hãy xác nhận bạn đồng ý cho hệ thống xử lý các thông tin
            cần thiết để tạo báo cáo cá nhân hóa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cream/60">
            (Skeleton — checkbox list sẽ render bằng <code>ConsentCheckboxList</code> từ
            <code> @hieu-asia/ui</code>.)
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
