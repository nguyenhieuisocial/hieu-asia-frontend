import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = { title: 'Phiên phân tích' };

export default function ReadingsPage() {
  return (
    <main className="container mx-auto max-w-5xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Phiên phân tích Celery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cream/60">(Skeleton — Phase 4.)</p>
        </CardContent>
      </Card>
    </main>
  );
}
