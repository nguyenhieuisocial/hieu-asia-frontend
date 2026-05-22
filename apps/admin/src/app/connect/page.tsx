'use client';

/**
 * /admin/connect — third-party connection control panel.
 *
 * Two sections:
 *   1. AI providers (Anthropic / OpenAI / Google) — API key / OAuth wire-up
 *   2. Service integrations (Resend / Langfuse / SePay / Sentry / PostHog)
 *      — each row has a "Test connection" button that pings the worker
 *        `/admin/<service>/health` endpoint. If the worker hasn't wired
 *        that route, the UI shows "Health check chưa wire" instead of a
 *        hard error.
 *
 * Styling matches the premium ink/gold theme used elsewhere in admin.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@hieu-asia/ui';
import {
  Plug,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';

type AiVendorId = 'anthropic' | 'openai' | 'google';
type Providers = Record<
  AiVendorId | 'cloudflare',
  { api_key: boolean; oauth: boolean }
>;

interface AiVendor {
  id: AiVendorId;
  name: string;
  roles: string;
  model: string;
  keyHint: string;
  keyUrl: string;
  oauth: boolean;
  oauthLabel: string;
  oauthHint: string;
}

const AI_VENDORS: ReadonlyArray<AiVendor> = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    roles: 'psychology · report · mentor · judge',
    model: 'claude-opus-4-7',
    keyHint: 'sk-ant-api03-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    oauth: false,
    oauthLabel: '',
    oauthHint: '',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    roles: 'logic · alignment',
    model: 'gpt-5.5',
    keyHint: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    oauth: false,
    oauthLabel: '',
    oauthHint: '',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    roles: 'vision (palm / face)',
    model: 'gemini-3.5-flash',
    keyHint: 'AI...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    oauth: true,
    oauthLabel: 'Login với Google (Gemini OAuth)',
    oauthHint:
      'Tab mới mở accounts.google.com → authorize → copy code từ codeassist.google.com → paste vào ô bên dưới.',
  },
];

interface ServiceIntegration {
  id: string;
  name: string;
  hint: string;
  /** Path appended to /api/admin-proxy/admin/ for health check. */
  healthPath: string;
  /** Optional doc link (opens external). */
  docUrl?: string;
}

const SERVICES: ReadonlyArray<ServiceIntegration> = [
  {
    id: 'resend',
    name: 'Resend (email)',
    hint: 'Transactional email — confirmations, magic-link, reports.',
    healthPath: 'resend/health',
    docUrl: 'https://resend.com/docs',
  },
  {
    id: 'langfuse',
    name: 'Langfuse (LLM tracing)',
    hint: 'Traces & evals cho mọi cuộc gọi LLM (latency, cost, prompts).',
    healthPath: 'langfuse/health',
    docUrl: 'https://langfuse.com/docs',
  },
  {
    id: 'sepay',
    name: 'SePay (payment)',
    hint: 'Webhook & intent flow cho gói trả phí (VNĐ).',
    healthPath: 'sepay/health',
    docUrl: 'https://docs.sepay.vn',
  },
  {
    id: 'sentry',
    name: 'Sentry (error tracking)',
    hint: 'Capture exception, performance, session replay.',
    healthPath: 'sentry/health',
    docUrl: 'https://docs.sentry.io',
  },
  {
    id: 'posthog',
    name: 'PostHog (analytics)',
    hint: 'Product analytics + feature flag + recording.',
    healthPath: 'posthog/health',
    docUrl: 'https://posthog.com/docs',
  },
];

type HealthResult =
  | { kind: 'ok'; detail?: string }
  | { kind: 'down'; detail: string }
  | { kind: 'not_wired'; detail: string };

async function pingHealth(path: string): Promise<HealthResult> {
  try {
    const r = await fetch(`/api/admin-proxy/admin/${path}`, { cache: 'no-store' });
    if (r.status === 404) {
      return { kind: 'not_wired', detail: 'Health check chưa wire ở worker.' };
    }
    const text = await r.text();
    let data: { ok?: boolean; status?: string; error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      // non-JSON response — treat as down
      return { kind: 'down', detail: `HTTP ${r.status} (non-JSON)` };
    }
    if (r.ok && data.ok !== false) {
      return { kind: 'ok', detail: data.status ?? 'reachable' };
    }
    return { kind: 'down', detail: data.error ?? `HTTP ${r.status}` };
  } catch (e) {
    return { kind: 'down', detail: (e as Error).message };
  }
}

function ServiceRow({ service }: { service: ServiceIntegration }) {
  const [result, setResult] = React.useState<HealthResult | null>(null);
  const [testing, setTesting] = React.useState(false);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    const r = await pingHealth(service.healthPath);
    setResult(r);
    setTesting(false);
  };

  const dotCls =
    result?.kind === 'ok'
      ? 'bg-emerald-400'
      : result?.kind === 'down'
        ? 'bg-red-400'
        : result?.kind === 'not_wired'
          ? 'bg-amber-400'
          : 'bg-muted/60';

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gold/15 bg-card/60 px-4 py-3 transition-colors hover:border-gold/25">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', dotCls)} aria-hidden />
          <p className="truncate font-medium text-foreground">{service.name}</p>
          {service.docUrl && (
            <a
              href={service.docUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-gold"
              aria-label={`docs ${service.name}`}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{service.hint}</p>
        {result && (
          <p
            className={cn(
              'mt-1.5 font-mono text-[11px]',
              result.kind === 'ok' && 'text-emerald-300',
              result.kind === 'down' && 'text-red-300',
              result.kind === 'not_wired' && 'text-amber-300',
            )}
          >
            {result.kind === 'ok' && (
              <>
                <CheckCircle2 className="-mt-0.5 mr-1 inline h-3 w-3" />
                OK — {result.detail}
              </>
            )}
            {result.kind === 'down' && (
              <>
                <XCircle className="-mt-0.5 mr-1 inline h-3 w-3" />
                {result.detail}
              </>
            )}
            {result.kind === 'not_wired' && (
              <>
                <AlertTriangle className="-mt-0.5 mr-1 inline h-3 w-3" />
                {result.detail}
              </>
            )}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={runTest}
        disabled={testing}
        className="shrink-0"
      >
        {testing ? (
          <>
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            Đang test…
          </>
        ) : (
          'Test connection'
        )}
      </Button>
    </div>
  );
}

interface AiCardProps {
  vendor: AiVendor;
  providers: Providers | null;
  model: string | undefined;
  onChange: () => void;
}

function AiVendorCard({ vendor, providers, model, onChange }: AiCardProps) {
  const st = providers?.[vendor.id];
  const connected = !!(st?.api_key || st?.oauth);
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState<{ kind: 'ok' | 'err' | 'pending'; text: string } | null>(
    null,
  );
  const [oauthState, setOAuthState] = React.useState<string | null>(null);
  const [oauthVisible, setOAuthVisible] = React.useState(false);

  const setSt = (kind: 'ok' | 'err' | 'pending', text: string) => setStatus({ kind, text });

  const onConnectKey = async () => {
    const input = document.getElementById(`key-${vendor.id}`) as HTMLInputElement;
    const key = input.value.trim();
    if (!key) return setSt('err', 'Vui lòng nhập API key');
    setBusy(true);
    setSt('pending', 'Đang validate với vendor…');
    try {
      const r = await fetch(`/api/admin/integrations/keys/${vendor.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key }),
      });
      const d = await r.json();
      if (d.ok) {
        input.value = '';
        setSt('ok', `Đã kết nối ${vendor.name} (API key)`);
        onChange();
      } else {
        setSt('err', d.error ?? 'Lỗi không xác định');
      }
    } catch (err) {
      setSt('err', (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onOAuthStart = async () => {
    setBusy(true);
    setSt('pending', 'Đang tạo OAuth flow…');
    try {
      const r = await fetch(`/api/admin/integrations/oauth/${vendor.id}/start`, {
        method: 'POST',
      });
      const d = await r.json();
      if (!d.ok) return setSt('err', d.error ?? 'Lỗi');
      setOAuthState(d.state);
      setOAuthVisible(true);
      setSt('pending', 'Mở tab mới → quay lại paste code bên dưới');
      window.open(d.auth_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setSt('err', (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onOAuthExchange = async () => {
    const input = document.getElementById(`oauth-code-${vendor.id}`) as HTMLInputElement;
    const code = input.value.trim();
    if (!code) return setSt('err', 'Paste code trước khi exchange');
    if (!oauthState) return setSt('err', 'OAuth state hết hạn — bấm lại OAuth');
    setBusy(true);
    setSt('pending', 'Đang exchange code…');
    try {
      const r = await fetch(`/api/admin/integrations/oauth/${vendor.id}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: oauthState, code }),
      });
      const d = await r.json();
      if (d.ok) {
        input.value = '';
        setOAuthVisible(false);
        setSt('ok', `Đã kết nối ${vendor.name} qua OAuth`);
        onChange();
      } else {
        setSt('err', d.error ?? 'Lỗi exchange');
      }
    } catch (err) {
      setSt('err', (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onRevoke = async () => {
    if (!confirm(`Revoke ${vendor.name} API key?`)) return;
    await fetch(`/api/admin/integrations/keys/${vendor.id}`, { method: 'DELETE' });
    onChange();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <span
                className={cn(
                  'inline-block h-2 w-2 rounded-full',
                  connected ? 'bg-emerald-400' : 'bg-muted/60',
                )}
              />
              {vendor.name}
            </CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">
              {model ?? vendor.model}
            </CardDescription>
          </div>
          {connected && (
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
              {st?.oauth ? 'OAuth' : 'API key'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">Roles: {vendor.roles}</p>

        {vendor.oauth && (
          <div>
            <Button
              size="sm"
              onClick={onOAuthStart}
              disabled={busy}
              className="bg-gold/20 text-gold hover:bg-gold/30"
            >
              {vendor.oauthLabel}
            </Button>
            {oauthVisible && (
              <div className="mt-2 rounded border border-gold/15 bg-card/60 p-2 text-xs">
                <p className="text-muted-foreground">{vendor.oauthHint}</p>
                <div className="mt-2 flex gap-2">
                  <input
                    id={`oauth-code-${vendor.id}`}
                    type="text"
                    placeholder="paste OAuth code"
                    className="flex-1 rounded-md border border-gold/20 bg-card/60 px-2 py-1.5 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-gold/50 focus:outline-none"
                  />
                  <Button size="sm" onClick={onOAuthExchange} disabled={busy}>
                    Exchange
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground">
            API key:{' '}
            <a href={vendor.keyUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline">
              {vendor.keyUrl.replace('https://', '')}
            </a>
          </p>
          <div className="mt-1.5 flex gap-2">
            <input
              id={`key-${vendor.id}`}
              type="password"
              placeholder={vendor.keyHint}
              className="flex-1 rounded-md border border-gold/20 bg-card/60 px-2 py-1.5 font-mono text-xs text-foreground placeholder:text-foreground/30 focus:border-gold/50 focus:outline-none"
            />
            <Button size="sm" onClick={onConnectKey} disabled={busy}>
              Connect
            </Button>
            {st?.api_key && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRevoke}
                className="border-red-400/40 text-red-300 hover:bg-red-500/10"
              >
                Revoke
              </Button>
            )}
          </div>
        </div>

        {status && (
          <div
            className={cn(
              'rounded border px-2 py-1 text-xs',
              status.kind === 'ok' && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
              status.kind === 'err' && 'border-red-500/40 bg-red-500/10 text-red-300',
              status.kind === 'pending' && 'border-gold/30 bg-gold/5 text-foreground/85',
            )}
          >
            {status.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProvidersResp {
  providers?: Providers;
  default_models?: Record<string, string>;
}

async function fetchProviders(): Promise<ProvidersResp> {
  const r = await fetch('/api/admin/integrations/providers', { cache: 'no-store' });
  if (!r.ok) return {};
  return (await r.json()) as ProvidersResp;
}

export default function ConnectPage() {
  const { data, refetch } = useQuery({
    queryKey: ['admin', 'connect', 'providers'],
    queryFn: fetchProviders,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kết nối"
        description="Wire-up các vendor AI và service tích hợp. Keys lưu encrypted trong Cloudflare KV."
        icon={<Plug className="h-5 w-5" />}
      />

      <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-foreground/85">
        <b className="text-gold">Lưu ý:</b> Google Gemini hỗ trợ OAuth. Anthropic và OpenAI chỉ
        chấp nhận API key — Anthropic disable OAuth cho Messages API từ Feb 2026, OpenAI Codex
        chỉ accept <code className="font-mono">localhost:1455</code> callback nên không web-paste
        được.
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Vendor AI
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {AI_VENDORS.map((v) => (
            <AiVendorCard
              key={v.id}
              vendor={v}
              providers={data?.providers ?? null}
              model={data?.default_models?.[v.id]}
              onChange={refetch}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Cloudflare Workers AI
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
                Native
              </span>
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              llama-3.3-70b-instruct · llama-3.2-vision-11b
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Active mặc định, không cần key. Dùng làm fallback khi vendor key chưa set hoặc bị
              rate-limit.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Service tích hợp
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Health checks</CardTitle>
            <CardDescription>
              Ping <code className="font-mono text-foreground/85">/admin/&lt;service&gt;/health</code>{' '}
              qua worker để kiểm tra kết nối thực tế.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {SERVICES.map((s) => (
              <ServiceRow key={s.id} service={s} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
