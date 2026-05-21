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
import { Check, Key, ShieldAlert, Trash2 } from 'lucide-react';
import {
  deleteWorkerSecret,
  fetchSecretsList,
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
  { name: 'RESEND_API_KEY',           desc: 'Resend HTTP API — transactional email.' },
  { name: 'ANTHROPIC_API_KEY',        desc: 'Claude Opus 4.7 — psychology / report / mentor / judge.' },
  { name: 'OPENAI_API_KEY',           desc: 'GPT-5.5 — logic / alignment.' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY',desc: 'Supabase service role — storage + edge functions.' },
  { name: 'VAPID_PUBLIC_KEY',         desc: 'Web Push public key (browser notifications).' },
  { name: 'VAPID_PRIVATE_KEY',        desc: 'Web Push private key — kept secret.' },
  { name: 'SERVICE_SHARED_TOKEN',     desc: 'Bot ↔ Worker service-to-service token.' },
  { name: 'ADMIN_SHARED_TOKEN',       desc: 'Admin shared token (legacy alias of ADMIN_TOKEN).' },
  { name: 'UPLOADS_SIGNING_SECRET',   desc: 'HMAC secret cho R2 presigned upload URLs.' },
  { name: 'SEPAY_WEBHOOK_SECRET',     desc: 'SePay webhook signature verification.' },
  { name: 'LANGFUSE_PUBLIC_KEY',      desc: 'Langfuse observability — public key.' },
  { name: 'LANGFUSE_SECRET_KEY',      desc: 'Langfuse observability — secret key.' },
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
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-gold/15 bg-ink/40 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cream">{def.name}</span>
          {isSet ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <Check className="h-3 w-3" /> Set
            </span>
          ) : (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream/60">
              Chưa set
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-cream/60">{def.desc}</p>
        <p className="mt-1 font-mono text-[10px] text-cream/40">
          Last set: {fmtTs(last?.set_at)} {last?.by_admin ? `· ${last.by_admin}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
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
}: {
  def: VercelKeyDef;
  entries: SecretAuditRecord[];
  onOpen: (name: string, defaultProject: VercelProject) => void;
}) {
  // Show latest across any project/target.
  const last = latestFor(entries, (e) => e.target === 'vercel' && e.name === def.name);
  const isSet = !!last && last.action !== 'delete';
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-gold/15 bg-ink/40 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cream">{def.name}</span>
          {isSet ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <Check className="h-3 w-3" /> Set
            </span>
          ) : (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream/60">
              Chưa set
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-cream/60">{def.desc}</p>
        <p className="mt-1 font-mono text-[10px] text-cream/40">
          Last set: {fmtTs(last?.set_at)}
          {last?.project ? ` · project=${last.project}` : ''}
          {last?.vercel_target ? ` · target=${last.vercel_target}` : ''}
          {last?.by_admin ? ` · ${last.by_admin}` : ''}
        </p>
      </div>
      <div className="shrink-0">
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
      <header className="flex items-start gap-3">
        <div className="rounded-md border border-gold/20 bg-gold/10 p-2 text-gold">
          <Key className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-cream">Quản lý API Keys</h1>
          <p className="mt-1 text-sm text-cream/65">
            Paste API key tại đây — backend gọi Cloudflare và Vercel API để rotate secrets.
            Giá trị không bao giờ được lưu trong KV, chỉ ghi nhận lần set vào audit log.
          </p>
        </div>
      </header>

      {/* Bootstrap banner */}
      {bootstrap && (!bootstrap.cf_token_set || !bootstrap.vercel_token_set) && (
        <Alert className="border-amber-700/50 bg-amber-900/20">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-200">Cần bootstrap 2 token một lần</AlertTitle>
          <AlertDescription className="space-y-2 text-amber-100/90">
            <p>
              Trước khi UI này hoạt động, set 2 token Cloudflare + Vercel cho Worker (1 lần
              duy nhất). Sau đó tất cả keys khác đều rotate được qua trang này.
            </p>
            <ul className="space-y-1 font-mono text-xs">
              <li>
                <span className={bootstrap.cf_token_set ? 'text-emerald-300' : 'text-red-300'}>
                  {bootstrap.cf_token_set ? '✓' : '✗'}
                </span>{' '}
                <code>{bootstrap.cli_hints.cf}</code>
              </li>
              <li>
                <span className={bootstrap.vercel_token_set ? 'text-emerald-300' : 'text-red-300'}>
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
              {list.isLoading && <p className="text-sm text-cream/60">Đang tải…</p>}
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
              {list.isLoading && <p className="text-sm text-cream/60">Đang tải…</p>}
              {VERCEL_KEYS.map((def) => (
                <VercelSecretRow
                  key={def.name}
                  def={def}
                  entries={entries}
                  onOpen={openVercel}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-cream/55">
        Cần audit chi tiết hơn? Xem{' '}
        <Link href="/settings" className="text-gold hover:underline">
          /settings
        </Link>{' '}
        hoặc kéo log audit qua{' '}
        <code className="font-mono text-cream/75">GET /admin/audit?actor_type=admin</code>.
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
              <code className="font-mono text-gold">{workerName}</code>.<br />
              Backend gọi Cloudflare API ngay; giá trị không lưu trong KV/DB.
            </DialogDescription>
          </DialogHeader>
          <Label className="text-xs uppercase tracking-wider text-cream/65">Giá trị</Label>
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
              Variable <code className="font-mono text-gold">{vercelName}</code>. Vercel sẽ
              auto-redeploy project khi env vars thay đổi.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-cream/65">Project</Label>
              <select
                value={vercelProject}
                onChange={(e) => setVercelProject(e.target.value as VercelProject)}
                className="mt-1 w-full rounded-md border border-gold/20 bg-ink px-3 py-2 text-sm text-cream"
              >
                <option value="web">web</option>
                <option value="admin">admin</option>
                <option value="miniapp">miniapp</option>
              </select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-cream/65">Target</Label>
              <select
                value={vercelTarget}
                onChange={(e) => setVercelTarget(e.target.value as VercelTarget)}
                className="mt-1 w-full rounded-md border border-gold/20 bg-ink px-3 py-2 text-sm text-cream"
              >
                <option value="production">production</option>
                <option value="preview">preview</option>
                <option value="development">development</option>
              </select>
            </div>
          </div>

          <Label className="mt-2 text-xs uppercase tracking-wider text-cream/65">Giá trị</Label>
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
    </div>
  );
}
