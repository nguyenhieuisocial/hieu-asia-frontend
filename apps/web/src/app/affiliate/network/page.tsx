/**
 * /affiliate/network — multi-tier affiliate network tree (L1/L2/L3).
 *
 * Pulls /aff/me (subtree stats + own network row) and /aff/children (direct
 * L1 children) from the worker using a Supabase JWT bearer token. Read-only;
 * onboarding is handled at /affiliate/signup.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  toast,
} from '@hieu-asia/ui';
import { Users, Network, TrendingUp, ChevronRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { AffiliateSubNav } from '@/components/affiliate/AffiliateSubNav';
import { getSupabaseAuth } from '@/lib/auth-client';
import { safeJson } from '@/lib/safe-json';
import { useFeatureFlag, FLAGS } from '@/lib/feature-flags';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

interface AffiliateNetwork {
  user_id: string;
  parent_user_id: string | null;
  affiliate_code: string;
  path: string;
  depth: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'suspended' | 'closed';
}

interface SubtreeStats {
  l1_count: number;
  l2_count: number;
  l3_count: number;
  total_subtree: number;
}

interface MeResponse {
  network: AffiliateNetwork | null;
  stats: SubtreeStats;
}

interface ChildrenResponse {
  children: AffiliateNetwork[];
}

function maskUserId(id: string): string {
  return `user_${id.slice(0, 6)}`;
}

const TIER_LABEL: Record<AffiliateNetwork['tier'], string> = {
  bronze: 'Đồng',
  silver: 'Bạc',
  gold: 'Vàng',
  platinum: 'Bạch kim',
};

const STATUS_LABEL: Record<AffiliateNetwork['status'], string> = {
  active: 'Hoạt động',
  suspended: 'Tạm ngừng',
  closed: 'Đã đóng',
};

const STATUS_CLASS: Record<AffiliateNetwork['status'], string> = {
  active: 'bg-jade-500/15 text-jade-300',
  suspended: 'bg-amber-500/15 text-amber-300',
  closed: 'bg-muted/10 text-muted-foreground',
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Affiliate', item: 'https://hieu.asia/affiliate' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Mạng lưới',
      item: 'https://hieu.asia/affiliate/network',
    },
  ],
};

export default function AffiliateNetworkPage() {
  const [me, setMe] = React.useState<MeResponse | null>(null);
  const [children, setChildren] = React.useState<AffiliateNetwork[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Wave 39 W-B — `affiliate_l2_visible` hides L2 commission card until the
  // multi-tier programme launches. Default false. When OFF, the L2 stat card
  // and the L2 row in the legal footer are dropped from the layout.
  const l2Visible = useFeatureFlag<boolean>(
    FLAGS.AFFILIATE_L2_VISIBLE,
    false,
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setError('auth_unavailable');
      setLoading(false);
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      setError('not_signed_in');
      setLoading(false);
      return;
    }
    try {
      const headers = { authorization: `Bearer ${token}` };
      const [meRes, chRes] = await Promise.all([
        fetch(`${API_BASE}/aff/me`, { headers, cache: 'no-store' }),
        fetch(`${API_BASE}/aff/children`, { headers, cache: 'no-store' }),
      ]);
      if (meRes.status === 401 || chRes.status === 401) {
        setError('not_signed_in');
        return;
      }
      const meJson = await safeJson<MeResponse>(meRes);
      const chJson = await safeJson<ChildrenResponse>(chRes);
      if (!meJson.ok) {
        setError(`Lỗi tải /aff/me (HTTP ${meJson.status})`);
        return;
      }
      setMe(meJson.data);
      if (chJson.ok) setChildren(chJson.data.children);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi mạng');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function copyLink(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã copy ${label}`);
    } catch {
      toast.error('Không thể copy. Hãy thử lại.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
          <Skeleton className="h-10 w-72" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="mt-6 h-40" />
          <Skeleton className="mt-6 h-64" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error === 'not_signed_in' || error === 'auth_unavailable') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 font-heading text-2xl font-bold">Đăng nhập để xem mạng lưới</h1>
            <p className="mb-6 text-muted-foreground">
              Bạn cần đăng nhập để xem mạng lưới affiliate của mình.
            </p>
            <Link href="/signin">
              <Button className="bg-gold text-ink hover:bg-gold/90">Đăng nhập</Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
          <div className="mx-auto max-w-md text-center">
            <p className="text-rose-300">{error}</p>
            <Button onClick={load} className="mt-4">Thử lại</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const stats = me?.stats ?? { l1_count: 0, l2_count: 0, l3_count: 0, total_subtree: 0 };
  const network = me?.network ?? null;
  const code = network?.affiliate_code ?? '';
  const shareLink = code ? `https://hieu.asia/?ref=${code}` : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Mạng lưới</span>
        </nav>

        <AffiliateSubNav />

        {/* Hero */}
        <header className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Affiliate · Network
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            {l2Visible
              ? 'Mạng lưới của bạn (L1 / L2 / L3)'
              : 'Mạng lưới của bạn (L1 / L3)'}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {l2Visible
              ? 'Đa tầng tối đa 3 cấp. Tuân thủ Nghị định 40/2018/NĐ-CP — hoa hồng chỉ trả khi có giao dịch thật.'
              : 'Đa tầng tối đa 2 cấp. Tuân thủ Nghị định 40/2018/NĐ-CP — hoa hồng chỉ trả khi có giao dịch thật.'}
          </p>
        </header>

        {/* Tier breakdown — L2 card gated by `affiliate_l2_visible` flag
            until the multi-tier programme launches. */}
        <section
          className={`grid gap-4 ${l2Visible ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
        >
          <Card className="border-gold/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                <CardTitle className="text-base">L1 (Trực tiếp)</CardTitle>
              </div>
              <CardDescription>30% hoa hồng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">{stats.l1_count}</div>
              <div className="mt-1 text-xs text-muted-foreground">người mời trực tiếp</div>
            </CardContent>
          </Card>
          {l2Visible && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-gold/70" />
                  <CardTitle className="text-base">L2 (Cấp 2)</CardTitle>
                </div>
                <CardDescription>5% hoa hồng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.l2_count}</div>
                <div className="mt-1 text-xs text-muted-foreground">người ở cấp 2</div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold/70" />
                <CardTitle className="text-base">L3 (Cấp 3)</CardTitle>
              </div>
              <CardDescription>2% hoa hồng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.l3_count}</div>
              <div className="mt-1 text-xs text-muted-foreground">người ở cấp 3</div>
            </CardContent>
          </Card>
        </section>

        {/* Affiliate code + share */}
        {network ? (
          <Card className="mt-6 border-gold/30">
            <CardHeader>
              <CardTitle className="text-base">Mã affiliate của bạn</CardTitle>
              <CardDescription>
                Chia sẻ link bên dưới để mời người khác. Cookie 30 ngày.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-mono text-2xl font-bold tracking-wider text-gold">
                  {code}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(code, 'mã')}
                >
                  Copy mã
                </Button>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${STATUS_CLASS[network.status]}`}
                >
                  {STATUS_LABEL[network.status]}
                </span>
                <span className="rounded bg-muted/10 px-2 py-0.5 text-xs text-muted-foreground">
                  Tier: {TIER_LABEL[network.tier]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <code className="break-all rounded bg-muted/[0.04] px-3 py-2 text-sm text-foreground/85">
                  {shareLink}
                </code>
                <Button
                  size="sm"
                  className="bg-gold text-ink hover:bg-gold/90"
                  onClick={() => copyLink(shareLink, 'link')}
                >
                  Copy link
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-6 border-border">
            <CardHeader>
              <CardTitle className="text-base">Chưa có mã affiliate</CardTitle>
              <CardDescription>
                Đăng ký affiliate để nhận mã chia sẻ và hoa hồng 3 tầng.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/affiliate/signup">
                <Button className="bg-gold text-ink hover:bg-gold/90">
                  Đăng ký affiliate
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Children list */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Mạng L1 trực tiếp</CardTitle>
            <CardDescription>
              Những người đăng ký từ link của bạn — họ là cấp 1 (30% hoa hồng).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="rounded border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                Chưa có ai gia nhập từ link của bạn. Chia sẻ link để bắt đầu.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="py-2 pr-3 font-normal">Tên</th>
                      <th className="py-2 pr-3 font-normal">Mã</th>
                      <th className="py-2 pr-3 font-normal">Tier</th>
                      <th className="py-2 pr-3 font-normal">Trạng thái</th>
                      <th className="py-2 pr-3 font-normal">Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((c) => (
                      <tr key={c.user_id} className="border-b border-border">
                        <td className="py-2 pr-3 font-mono text-foreground/80">
                          {maskUserId(c.user_id)}
                        </td>
                        <td className="py-2 pr-3 font-mono text-gold">{c.affiliate_code}</td>
                        <td className="py-2 pr-3">{TIER_LABEL[c.tier]}</td>
                        <td className="py-2 pr-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${STATUS_CLASS[c.status]}`}
                          >
                            {STATUS_LABEL[c.status]}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">
                          <span className="font-mono">L{c.depth}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance note */}
        <Card className="mt-6 border-amber-500/40 bg-amber-500/[0.04]">
          <CardHeader>
            <CardTitle className="text-base text-amber-200">Lưu ý pháp lý</CardTitle>
            <CardDescription className="text-muted-foreground">
              Hoa hồng tại hieu.asia tuân thủ Nghị định 40/2018/NĐ-CP về bán hàng đa cấp.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1.5">
              <li>
                •{' '}
                {l2Visible
                  ? 'Cấp tối đa 3 tầng (L1=30%, L2=5%, L3=2%).'
                  : 'Cấp tối đa 2 tầng (L1=30%, L3=2%).'}
              </li>
              <li>• Hoa hồng chỉ trả khi có giao dịch thật, KHÔNG dựa trên tuyển dụng.</li>
              <li>• Không thu phí gia nhập.</li>
              <li>• Người mua không bị buộc phải mua tối thiểu để duy trì tư cách.</li>
              <li>• User có quyền rút khỏi mạng lưới bất kỳ lúc nào.</li>
            </ul>
            <div className="mt-3">
              <Link
                href="/affiliate/terms"
                className="inline-flex items-center gap-1 text-amber-200 hover:underline"
              >
                Xem chi tiết chính sách
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {!network && (
            <Link href="/affiliate/signup">
              <Button className="bg-gold text-ink hover:bg-gold/90">Đăng ký affiliate</Button>
            </Link>
          )}
          <Link href="/affiliate/commissions">
            <Button variant="outline">Xem hoa hồng</Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Tổng cây: {stats.total_subtree} người{' '}
          {l2Visible ? '(L1 + L2 + L3).' : '(L1 + L3).'}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
