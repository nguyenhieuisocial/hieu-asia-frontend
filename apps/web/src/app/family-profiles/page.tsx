import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  AlertTriangle,
  ArrowRight,
  Lock,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Family Profiles — Hiểu cả nhà',
  description:
    'Tạo profile cho người thân (cha mẹ, vợ/chồng, con) để hiểu giao tiếp và lập kế hoạch chung. Privacy-first: phân tích basic, không deep reading khi chưa có sự đồng ý.',
  alternates: { canonical: 'https://hieu.asia/family-profiles' },
  openGraph: {
    title: 'Family Profiles — Hiểu cả nhà',
    description: 'Profile thành viên gia đình để hiểu giao tiếp và tránh xung đột.',
    url: 'https://hieu.asia/family-profiles',
    type: 'article',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Family Profiles',
      item: 'https://hieu.asia/family-profiles',
    },
  ],
};

const STEPS = [
  {
    n: 1,
    title: 'Nhập thông tin cơ bản',
    body:
      'User nhập ngày sinh + tên gọi (không cần tên thật) của thành viên gia đình.',
  },
  {
    n: 2,
    title: 'Tạo profile basic',
    body:
      'Hệ thống tạo profile cơ bản: zodiac, ngũ hành, tổng quát tính cách. Không deep reading.',
  },
  {
    n: 3,
    title: 'Ghép với lá số của bạn',
    body:
      'Hệ thống ghép profile với lá số user → gợi ý giao tiếp + tránh xung đột.',
  },
];

const PRIVACY_BULLETS: { icon: typeof Lock; text: string }[] = [
  {
    icon: Lock,
    text:
      'Profile thành viên chỉ lưu trong tài khoản của bạn (không share, không index).',
  },
  {
    icon: ShieldCheck,
    text:
      'Chỉ làm phân tích basic, không deep reading khi chưa có sự đồng ý của họ.',
  },
  {
    icon: Trash2,
    text: 'Bạn có thể xoá profile bất cứ lúc nào — không giữ bản backup.',
  },
  {
    icon: UserPlus,
    text:
      'Mời thành viên tự tạo tài khoản nếu muốn deep reading dành riêng cho họ.',
  },
];

const DEMO_PROFILES = [
  {
    label: 'Cha',
    summary:
      'Tuổi Quý Mão · ngũ hành Kim. Người thực tế, thiên về kết quả hơn lý thuyết.',
    tip:
      'Giao tiếp: nói gọn, đi thẳng kết quả. Tránh giải thích dài dòng quy trình.',
  },
  {
    label: 'Mẹ',
    summary:
      'Tuổi Bính Ngọ · ngũ hành Hoả. Nhạy cảm với không khí gia đình, ưu tiên kết nối.',
    tip:
      'Giao tiếp: hỏi cảm xúc trước, giải pháp sau. Cuối tuần dành thời gian gọi điện.',
  },
  {
    label: 'Vợ/Chồng',
    summary:
      'Tuổi Mậu Thìn · ngũ hành Mộc. Cần không gian riêng để xử lý, không thích bị thúc.',
    tip:
      'Giao tiếp: nêu vấn đề + cho thời gian suy nghĩ. Tránh ép quyết định ngay.',
  },
];

export default function FamilyProfilesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Family Profiles</span>
        </nav>

        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Family Profiles
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Hiểu cả nhà
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tạo profile cho người thân (cha mẹ, vợ/chồng, con) để hiểu giao tiếp
            và lập kế hoạch chung.
          </p>
          <div
            role="note"
            className="mt-5 flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-500/[0.06] p-4 text-sm text-amber-100/85"
          >
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
              aria-hidden="true"
            />
            <p>
              <strong className="text-amber-200">Lưu ý.</strong> KHÔNG luận sâu lá
              số người thân khi chưa có sự đồng ý của họ. Tính năng này chỉ làm
              phân tích basic và gợi ý giao tiếp.
            </p>
          </div>
        </header>

        <section aria-labelledby="how-heading" className="mb-12">
          <h2
            id="how-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            Cách thức hoạt động
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.n} className="border-border bg-card/40">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-xs font-medium text-gold">
                      {s.n}
                    </span>
                    <CardTitle className="font-heading text-base">
                      {s.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="privacy-heading" className="mb-12">
          <h2
            id="privacy-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            Quyền riêng tư
          </h2>
          <Card className="border-amber-400/30 bg-amber-500/[0.05]">
            <CardContent className="p-6">
              <ul className="space-y-4 text-sm text-foreground/85">
                {PRIVACY_BULLETS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <li key={b.text} className="flex items-start gap-3">
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden="true"
                      />
                      <span>{b.text}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="demo-heading" className="mb-12">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-4 w-4 text-gold" aria-hidden="true" />
            <h2
              id="demo-heading"
              className="font-heading text-lg font-semibold sm:text-xl"
            >
              Demo profiles
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {DEMO_PROFILES.map((p) => (
              <Card key={p.label} className="border-border bg-card/40">
                <CardHeader>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                    Thành viên
                  </p>
                  <CardTitle className="font-heading text-lg">
                    {p.label}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {p.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">Gợi ý:</strong> {p.tip}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Tính năng đang phát triển. Đăng ký để được thông báo khi
                    launch.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Tiếp theo
            </p>
          </div>
          <h2 className="mt-2 font-heading text-lg font-semibold sm:text-xl">
            Bắt đầu với lá số của bạn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Có lá số cá nhân trước — sau đó hệ thống mới ghép được profile thành
            viên với bạn.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/onboarding/topic">
              <Button size="lg">
                Lập lá số cá nhân
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/compatibility">
              <Button size="lg" variant="outline">
                So 2 lá số đã có sẵn
              </Button>
            </Link>
          </div>
        </section>
      </section>

      <SiteFooter />
    </div>
  );
}
