import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <h1 className="font-heading text-xl text-gold">admin.hieu.asia</h1>
        <ThemeToggle />
      </header>

      <section className="container mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: '/users', title: 'Người dùng', desc: 'Danh sách user + filter.' },
          { href: '/readings', title: 'Phiên phân tích', desc: 'Task Celery + status.' },
          { href: '/rag', title: 'RAG', desc: 'Quản lý tài liệu + license metadata.' },
        ].map((it) => (
          <Link key={it.href} href={it.href as never}>
            <Card className="transition hover:border-gold/40">
              <CardHeader>
                <CardTitle>{it.title}</CardTitle>
                <CardDescription>{it.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gold/80">→ Mở</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
