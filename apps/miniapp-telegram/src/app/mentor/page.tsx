import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = { title: 'Mentor' };

export default function MentorPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Trò chuyện với Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cream/60">(Skeleton — Phase 3.)</p>
        </CardContent>
      </Card>
    </main>
  );
}
