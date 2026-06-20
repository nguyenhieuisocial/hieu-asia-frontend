'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@hieu-asia/ui';
import { Check, Copy, Eye, EyeOff, Key, ShieldAlert, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  deleteWorkerSecret,
  fetchSecretsList,
  revealVercelEnv,
  setVercelEnv,
  setWorkerSecret,
  type SecretAuditRecord,
  type VercelProject,
  type VercelTarget,
} from '@/lib/secrets-api';

// ---------- Expected key registry ----------------------------------------------

interface WorkerKeyDef {
  name: string;
  desc: string;
}

const WORKER_KEYS: WorkerKeyDef[] = [
  { name: 'ADMIN_TOKEN',              desc: 'Admin gate (X-Admin-Token) for all /admin/* routes.' },
  { name: 'SERVICE_TOKEN',            desc: 'Service-to-service token (Bot ↔ Worker, Edge Functions).' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY',desc: 'Supabase service role JWT — RLS bypass for admin queries.' },
  { name: 'SUPABASE_ANON_KEY',        desc: 'Supabase anon JWT — fallback when service role unavailable.' },
  { name: 'RESEND_API_KEY',           desc: 'Resend HTTP API — transactional email.' },
  { name: 'RESEND_NEWSLETTER_AUDIENCE_ID', desc: 'Resend Audience ID — publish newsletter qua Broadcast (/content publish).' },
  { name: 'ANTHROPIC_API_KEY',        desc: 'Anthropic Claude — primary LLM for reading + mentor.' },
  { name: 'OPENAI_API_KEY',           desc: 'OpenAI GPT — fallback LLM, embeddings.' },
  { name: 'GOOGLE_API_KEY',           desc: 'Google Gemini — Vision / OCR for palm reading.' },
  { name: 'VAPID_PUBLIC_KEY',         desc: 'Web Push public key (browser notifications).' },
  { name: 'VAPID_PRIVATE_KEY',        desc: 'Web Push private key — kept secret.' },
  { name: 'VAPID_SUBJECT',            desc: 'RFC 8292 contact (mailto:admin@hieu.asia).' },
  { name: 'UPLOADS_SIGNING_SECRET',   desc: 'HMAC secret cho R2 presigned upload URLs.' },
  { name: 'SEPAY_WEBHOOK_SECRET',     desc: 'SePay webhook signature verification.' },
  { name: 'LANGFUSE_PUBLIC_KEY',      desc: 'Langfuse observability — public key (pk_lf_*).' },
  { name: 'LANGFUSE_SECRET_KEY',      desc: 'Langfuse observability — secret key (sk_lf_*).' },
  { name: 'SENTRY_DSN',               desc: 'Sentry error tracking DSN (optional).' },
  { name: 'TELEGRAM_BOT_TOKEN',       desc: 'Telegram bot — daily horoscope + mentor proxy.' },
  { name: 'GSC_SA_KEY',               desc: 'Google service-account JSON key cho Search Console (đọc từ khoá tìm kiếm).' },
  { name: 'GSC_SITE_URL',             desc: 'GSC property, vd sc-domain:hieu.asia hoặc https://hieu.asia/' },
  { name: 'ADMIN_CF_API_TOKEN',       desc: 'Bootstrap — CF API token (Workers Scripts Write).' },
  { name: 'ADMIN_VERCEL_TOKEN',       desc: 'Bootstrap — Vercel API token (env vars Write).' },
];

interface VercelKeyDef {
  name: string;
  desc: string;
  defaultProject: VercelProject;
}

const VERCEL_KEYS: VercelKeyDef[] = [
  { name: 'NEXT_PUBLIC_POSTHOG_KEY',              desc: 'PostHog browser key (public).',     defaultProject: 'web' },
  { name: 'NEXT_PUBLIC_POSTHOG_HOST',             desc: 'PostHog host (public, e.g. https://eu.i.posthog.com).', defaultProject: 'web' },
  { name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', desc: 'Supabase anon/publishable key (browser-safe).', defaultProject: 'web' },
  { name: 'NEXT_PUBLIC_SUPABASE_URL',             desc: 'Supabase project URL.',             defaultProject: 'web' },
  { name: 'HIEU_API_ADMIN_TOKEN',                 desc: 'Admin-app shared admin token (server-only).', defaultProject: 'admin' },
  { name: 'HIEU_API_GATEWAY_URL',                 desc: 'Backend gateway URL (https://api.hieu.asia).', defaultProject: 'admin' },
];

// ---------- Helpers ------------------------------------------------------------

function latestFor(
  entries: SecretAuditRecord[],
  predicate: (e: SecretAuditRecord) => boolean,
): SecretAuditRecord | undefined {
  for (const e of entries) if (predicate(e)) return e;
  return undefined;
}

function fmtTs(ts?: string): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return ts;
  }
}

const ROTATION_DUE_DAYS = 90;

/**
 * Read-only rotation hint derived from a secret's `set_at`. Pure presentation:
 * shows "đặt N ngày trước" and tints red once a secret is older than
 * ROTATION_DUE_DAYS. Returns null when no usable timestamp exists (e.g. unset,
 * or CLI-set worker secrets with an empty set_at) so we never fabricate an age.
 */
function rotationHint(setAt?: string): { label: string; due: boolean } | null {
  if (!setAt) return null;
  const t = new Date(setAt).getTime();
  if (Number.isNaN(t)) return null;
  const days = Math.floor((Date.now() - t) / 86_400_000);
  if (days < 0) return null;
  return { label: `đặt ${days} ngày trước`, due: days >= ROTATION_DUE_DAYS };
}

/** Small read-only badge surfacing secret age + a "nên xoay vòng" warning. */
function RotationBadge({ setAt }: { setAt?: string }) {
  const hint = rotationHint(setAt);
  if (!hint) return null;
  return (
    <span
      title={
        hint.due
          ? `Đặt hơn ${ROTATION_DUE_DAYS} ngày trước — nên xoay vòng (rotate) secret này.`
          : 'Tuổi của secret tính từ lần set gần nhất.'
      }
      className={
        hint.due
          ? 'inline-flex items-center gap-1 rounded-full bg-red-900/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300'
          : 'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-wider text-muted-foreground'
      }
    >
      {hint.due ? `${hint.label} · nên xoay vòng` : hint.label}
    </span>
  );
}

async function copyToClipboard(text: string, label: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} đã copy vào clipboard.`);
      return;
    }
    throw new Error('Clipboard API không khả dụng');
  } catch (err) {
    toast.error(`Copy thất bại: ${(err as Error).message}`);
  }
}

/** Inline copy-name button — used in every secret row. */
function CopyNameButton({ name }: { name: string }) {
  return (
    <button
      type="button"
      title={`Copy "${name}"`}
      aria-label={`Copy ${name}`}
      onClick={(e) => {
        e.stopPropagation();
        void copyToClipboard(name, name);
      }}
      className="rounded p-1 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
    >
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
}

/**
 * Reveal modal — shows a decrypted Vercel env value with a countdown auto-dismiss.
 * Value is held only in React state; never persisted. Modal closes when countdown
 * hits 0 OR user dismisses manually. Copy button writes value to clipboard.
 */
function RevealModal({
  open,
  onClose,
  name,
  value,
  ttlSeconds,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  value: string;
  ttlSeconds: number;
}) {
  const [remaining, setRemaining] = React.useState(ttlSeconds);

  React.useEffect(() => {
    if (!open) return;
    setRemaining(ttlSeconds);
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          onClose();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, ttlSeconds, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Giá trị secret
          </DialogTitle>
          <DialogDescription>
            <code className="font-mono text-primary">{name}</code> — modal tự đóng sau{' '}
            <span className="font-semibold text-amber-700 dark:text-amber-300">{remaining}s</span>. Đừng paste vào
            chat / chỗ công cộng.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 break-all rounded-md border border-primary/20 bg-background px-3 py-2 font-mono text-xs text-foreground">
          {value}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => void copyToClipboard(value, name)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Đóng ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Worker secret row + modal -----------------------------------------

function WorkerSecretRow({
  def,
  entries,
  onOpen,
  onDelete,
}: {
  def: WorkerKeyDef;
  entries: SecretAuditRecord[];
  onOpen: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const last = latestFor(entries, (e) => e.target === 'worker' && e.name === def.name);
  const isSet = !!last && last.action !== 'delete';
  // CLI-set worker secrets land in /list with set_at:"" + by_admin:"cli" because
  // wrangler doesn't go through our audit log. Surface this honestly instead of
  // showing a bogus "—" with no explanation.
  const setViaCli = isSet && !last?.set_at && last?.by_admin === 'cli';
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-primary/15 bg-card/60 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">{def.name}</span>
          <CopyNameButton name={def.name} />
          {isSet ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <Check className="h-3 w-3" /> Set
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chưa set
            </span>
          )}
          <RotationBadge setAt={last?.set_at} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{def.desc}</p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Last set: {setViaCli ? 'set via wrangler CLI (timestamp unknown)' : fmtTs(last?.set_at)}
          {last?.by_admin && !setViaCli ? ` · ${last.by_admin}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="ghost"
          disabled
          title="Worker secrets là write-only trên Cloudflare — không đọc được. Dùng nút Cập nhật để rotate."
          className="text-muted-foreground"
        >
          <EyeOff className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onOpen(def.name)}>
          {isSet ? 'Cập nhật' : 'Set'}
        </Button>
        {isSet && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(def.name)}
            className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------- Vercel secret row + modal -----------------------------------------

function VercelSecretRow({
  def,
  entries,
  onOpen,
  onReveal,
  revealing,
}: {
  def: VercelKeyDef;
  entries: SecretAuditRecord[];
  onOpen: (name: string, defaultProject: VercelProject) => void;
  onReveal: (name: string, project: VercelProject) => void;
  revealing: boolean;
}) {
  // Show latest across any project/target.
  const last = latestFor(entries, (e) => e.target === 'vercel' && e.name === def.name);
  const isSet = !!last && last.action !== 'delete';
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-primary/15 bg-card/60 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">{def.name}</span>
          <CopyNameButton name={def.name} />
          {isSet ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <Check className="h-3 w-3" /> Set
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chưa set
            </span>
          )}
          <RotationBadge setAt={last?.set_at} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{def.desc}</p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Last set: {fmtTs(last?.set_at)}
          {last?.project ? ` · project=${last.project}` : ''}
          {last?.vercel_target ? ` · target=${last.vercel_target}` : ''}
          {last?.by_admin ? ` · ${last.by_admin}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="ghost"
          disabled={revealing}
          title={`Xem giá trị hiện tại (project=${def.defaultProject}) — audit-logged, 10s auto-close`}
          onClick={() => onReveal(def.name, def.defaultProject)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onOpen(def.name, def.defaultProject)}>
          {isSet ? 'Cập nhật' : 'Set'}
        </Button>
      </div>
    </div>
  );
}

// ---------- Page --------------------------------------------------------------

export default function SecretsPage() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'secrets', 'list'],
    queryFn: fetchSecretsList,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const entries = list.data?.entries ?? [];
  const bootstrap = list.data?.bootstrap;

  // -- Worker modal --
  const [workerOpen, setWorkerOpen] = React.useState(false);
  const [workerName, setWorkerName] = React.useState<string>('');
  const [workerValue, setWorkerValue] = React.useState('');

  const workerMut = useMutation({
    mutationFn: (vars: { name: string; value: string }) => setWorkerSecret(vars.name, vars.value),
    onSuccess: (d) => {
      toast.success(`${d.name} đã set trên Worker.`);
      setWorkerOpen(false);
      setWorkerValue('');
      qc.invalidateQueries({ queryKey: ['admin', 'secrets', 'list'] });
    },
    onError: (e: Error) => toast.error(`Set thất bại: ${e.message}`),
  });

  const workerDelMut = useMutation({
    mutationFn: (name: string) => deleteWorkerSecret(name),
    onSuccess: (_d, name) => {
      toast.success(`${name} đã xoá khỏi Worker.`);
      qc.invalidateQueries({ queryKey: ['admin', 'secrets', 'list'] });
    },
    onError: (e: Error) => toast.error(`Xoá thất bại: ${e.message}`),
  });

  // -- Vercel modal --
  const [vercelOpen, setVercelOpen] = React.useState(false);
  const [vercelName, setVercelName] = React.useState<string>('');
  const [vercelValue, setVercelValue] = React.useState('');
  const [vercelProject, setVercelProject] = React.useState<VercelProject>('web');
  const [vercelTarget, setVercelTarget] = React.useState<VercelTarget>('production');

  const vercelMut = useMutation({
    mutationFn: setVercelEnv,
    onSuccess: (d) => {
      toast.success(`${d.name} set trên Vercel (${d.project}/${d.vercel_target}).`);
      setVercelOpen(false);
      setVercelValue('');
      qc.invalidateQueries({ queryKey: ['admin', 'secrets', 'list'] });
    },
    onError: (e: Error) => toast.error(`Set thất bại: ${e.message}`),
  });

  // -- Reveal modal (Vercel only — worker secrets are write-only) --
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [revealedValue, setRevealedValue] = React.useState('');
  const [revealedName, setRevealedName] = React.useState('');
  const [revealedTtl, setRevealedTtl] = React.useState(10);

  const revealMut = useMutation({
    mutationFn: (vars: { name: string; project: VercelProject }) =>
      revealVercelEnv({ name: vars.name, project: vars.project, target: 'production' }),
    onSuccess: (d) => {
      setRevealedName(d.name);
      setRevealedValue(d.value);
      setRevealedTtl(d.ttl_seconds ?? 10);
      setRevealOpen(true);
    },
    onError: (e: Error) => toast.error(`Reveal thất bại: ${e.message}`),
  });

  const openReveal = (name: string, project: VercelProject) =>
    revealMut.mutate({ name, project });

  const openWorker = (name: string) => {
    setWorkerName(name);
    setWorkerValue('');
    setWorkerOpen(true);
  };
  const openVercel = (name: string, defaultProject: VercelProject) => {
    setVercelName(name);
    setVercelValue('');
    setVercelProject(defaultProject);
    setVercelTarget('production');
    setVercelOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý API Keys"
        description="Paste API key tại đây — backend gọi Cloudflare và Vercel API để rotate secrets. Giá trị không bao giờ được lưu trong KV, chỉ ghi nhận lần set vào audit log."
        icon={<Key className="h-5 w-5" />}
      />

      {/* Bootstrap banner */}
      {bootstrap && (!bootstrap.cf_token_set || !bootstrap.vercel_token_set) && (
        <Alert className="border-amber-700/50 bg-amber-900/20">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-700 dark:text-amber-200">Cần bootstrap 2 token một lần</AlertTitle>
          <AlertDescription className="space-y-2 text-amber-700/90 dark:text-amber-100/90">
            <p>
              Trước khi UI này hoạt động, set 2 token Cloudflare + Vercel cho Worker (1 lần
              duy nhất). Sau đó tất cả keys khác đều rotate được qua trang này.
            </p>
            <ul className="space-y-1 font-mono text-xs">
              <li>
                <span className={bootstrap.cf_token_set ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                  {bootstrap.cf_token_set ? '✓' : '✗'}
                </span>{' '}
                <code>{bootstrap.cli_hints.cf}</code>
              </li>
              <li>
                <span className={bootstrap.vercel_token_set ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                  {bootstrap.vercel_token_set ? '✓' : '✗'}
                </span>{' '}
                <code>{bootstrap.cli_hints.vercel}</code>
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="worker">
        <TabsList>
          <TabsTrigger value="worker">Worker Secrets (Cloudflare)</TabsTrigger>
          <TabsTrigger value="vercel">Vercel Env Vars</TabsTrigger>
        </TabsList>

        <TabsContent value="worker">
          <Card>
            <CardHeader>
              <CardTitle>Cloudflare Worker secrets</CardTitle>
              <CardDescription>
                Backend script <code className="font-mono text-xs">hieu-asia-api</code> — gọi
                vendor APIs, ký HMAC, gửi email. Set xong là worker tự pick up trong vài giây.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {list.isLoading && <p className="text-sm text-muted-foreground">Đang tải…</p>}
              {list.isError && (
                <p className="text-sm text-red-400">
                  Không kết nối được backend: {(list.error as Error).message}
                </p>
              )}
              {WORKER_KEYS.map((def) => (
                <WorkerSecretRow
                  key={def.name}
                  def={def}
                  entries={entries}
                  onOpen={openWorker}
                  onDelete={(n) => workerDelMut.mutate(n)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vercel">
          <Card>
            <CardHeader>
              <CardTitle>Vercel Environment Variables</CardTitle>
              <CardDescription>
                Frontend (web / admin / miniapp). Chọn project + target khi set. Vercel
                auto-redeploy khi env var thay đổi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {list.isLoading && <p className="text-sm text-muted-foreground">Đang tải…</p>}
              {VERCEL_KEYS.map((def) => (
                <VercelSecretRow
                  key={def.name}
                  def={def}
                  entries={entries}
                  onOpen={openVercel}
                  onReveal={openReveal}
                  revealing={revealMut.isPending}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        Cần audit chi tiết hơn? Xem{' '}
        <Link href="/settings" className="text-primary hover:underline">
          /settings
        </Link>{' '}
        hoặc kéo log audit qua{' '}
        <code className="font-mono text-foreground/85">GET /admin/audit?actor_type=admin</code>.
      </div>

      {/* Worker secret modal */}
      <Dialog
        open={workerOpen}
        onOpenChange={(o) => {
          setWorkerOpen(o);
          if (!o) setWorkerValue('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Worker secret</DialogTitle>
            <DialogDescription>
              Worker <code className="font-mono">hieu-asia-api</code> · key{' '}
              <code className="font-mono text-primary">{workerName}</code>.<br />
              Backend gọi Cloudflare API ngay; giá trị không lưu trong KV/DB.
            </DialogDescription>
          </DialogHeader>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Giá trị</Label>
          <Input
            type="password"
            autoFocus
            value={workerValue}
            onChange={(e) => setWorkerValue(e.target.value)}
            placeholder="paste secret value"
            className="font-mono"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setWorkerOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => workerMut.mutate({ name: workerName, value: workerValue })}
              disabled={!workerValue || workerMut.isPending}
            >
              {workerMut.isPending ? 'Đang set…' : 'Set secret'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vercel env modal */}
      <Dialog
        open={vercelOpen}
        onOpenChange={(o) => {
          setVercelOpen(o);
          if (!o) setVercelValue('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Vercel env var</DialogTitle>
            <DialogDescription>
              Variable <code className="font-mono text-primary">{vercelName}</code>. Vercel sẽ
              auto-redeploy project khi env vars thay đổi.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Project</Label>
              <select
                value={vercelProject}
                onChange={(e) => setVercelProject(e.target.value as VercelProject)}
                className="mt-1 w-full rounded-md border border-primary/20 bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="web">web</option>
                <option value="admin">admin</option>
                <option value="miniapp">miniapp</option>
              </select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target</Label>
              <select
                value={vercelTarget}
                onChange={(e) => setVercelTarget(e.target.value as VercelTarget)}
                className="mt-1 w-full rounded-md border border-primary/20 bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="production">production</option>
                <option value="preview">preview</option>
                <option value="development">development</option>
              </select>
            </div>
          </div>

          <Label className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Giá trị</Label>
          <Input
            type="password"
            autoFocus
            value={vercelValue}
            onChange={(e) => setVercelValue(e.target.value)}
            placeholder="paste secret value"
            className="font-mono"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setVercelOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() =>
                vercelMut.mutate({
                  name: vercelName,
                  value: vercelValue,
                  project: vercelProject,
                  target: vercelTarget,
                })
              }
              disabled={!vercelValue || vercelMut.isPending}
            >
              {vercelMut.isPending ? 'Đang set…' : 'Set env var'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal modal — shows decrypted Vercel env value, auto-closes after TTL. */}
      <RevealModal
        open={revealOpen}
        onClose={() => {
          setRevealOpen(false);
          setRevealedValue('');
          setRevealedName('');
        }}
        name={revealedName}
        value={revealedValue}
        ttlSeconds={revealedTtl}
      />
    </div>
  );
}
