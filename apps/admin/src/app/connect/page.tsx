'use client';

import * as React from 'react';

type Providers = Record<
  'anthropic' | 'openai' | 'google' | 'cloudflare',
  { api_key: boolean; oauth: boolean }
>;

const VENDORS = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    roles: 'psychology • report • mentor • judge',
    model: 'claude-opus-4-7',
    keyHint: 'sk-ant-api03-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    // Anthropic disabled OAuth-token use on /v1/messages cho third-party tools
    // từ ~Feb 2026. Subscription OAuth chỉ còn hoạt động trong Claude Code/Claude.ai.
    // Force API key (sk-ant-api03-*) — workspace billing, charge riêng.
    oauth: false,
    oauthLabel: '',
    oauthHint: '',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    roles: 'logic • alignment',
    model: 'gpt-5.5',
    keyHint: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    // OpenAI Codex OAuth dùng localhost:1455 callback — không web-paste được.
    // Chỉ chạy được khi cài Codex CLI local. Ở đây chỉ hỗ trợ API key.
    oauth: false,
    oauthLabel: '',
    oauthHint: '',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    roles: 'vision (palm/face)',
    model: 'gemini-3.5-flash',
    keyHint: 'AI...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    oauth: true,
    oauthLabel: 'Login với Google (Gemini CLI OAuth)',
    oauthHint:
      'Tab mới mở accounts.google.com → authorize → codeassist.google.com hiển thị code → copy paste vào đây',
  },
] as const;

export default function ConnectPage() {
  const [providers, setProviders] = React.useState<Providers | null>(null);
  const [models, setModels] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<Record<string, { kind: 'ok' | 'err' | 'pending'; text: string }>>({});
  const [oauthState, setOAuthState] = React.useState<Record<string, string>>({});
  const [oauthVisible, setOAuthVisible] = React.useState<Record<string, boolean>>({});

  const refresh = React.useCallback(async () => {
    const r = await fetch('/api/admin/integrations/providers', { cache: 'no-store' });
    const data = await r.json();
    setProviders(data.providers);
    setModels(data.default_models ?? {});
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const setStatus = (id: string, kind: 'ok' | 'err' | 'pending', text: string) =>
    setMsg((m) => ({ ...m, [id]: { kind, text } }));

  const onConnectKey = async (vendor: string) => {
    const input = document.getElementById(`key-${vendor}`) as HTMLInputElement;
    const key = input.value.trim();
    if (!key) {
      setStatus(vendor, 'err', 'Vui lòng nhập API key');
      return;
    }
    setBusy(vendor);
    setStatus(vendor, 'pending', 'Đang validate với vendor...');
    try {
      const r = await fetch(`/api/admin/integrations/keys/${vendor}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key }),
      });
      const d = await r.json();
      if (d.ok) {
        input.value = '';
        setStatus(vendor, 'ok', `✓ ${vendor} đã kết nối (API key)`);
        refresh();
      } else {
        setStatus(vendor, 'err', `✗ ${d.error ?? 'Lỗi không xác định'}`);
      }
    } catch (err) {
      setStatus(vendor, 'err', `✗ ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const onOAuthStart = async (vendor: string) => {
    setBusy(vendor);
    setStatus(vendor, 'pending', 'Đang tạo OAuth flow...');
    try {
      const r = await fetch(`/api/admin/integrations/oauth/${vendor}/start`, { method: 'POST' });
      const d = await r.json();
      if (!d.ok) {
        setStatus(vendor, 'err', `✗ ${d.error ?? 'Lỗi'}`);
        return;
      }
      setOAuthState((s) => ({ ...s, [vendor]: d.state }));
      setOAuthVisible((s) => ({ ...s, [vendor]: true }));
      setStatus(vendor, 'pending', 'Mở tab mới để authorize → quay lại paste code dưới đây');
      window.open(d.auth_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setStatus(vendor, 'err', `✗ ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const onOAuthExchange = async (vendor: string) => {
    const input = document.getElementById(`oauth-code-${vendor}`) as HTMLInputElement;
    const code = input.value.trim();
    const state = oauthState[vendor];
    if (!code) {
      setStatus(vendor, 'err', 'Paste code trước khi exchange');
      return;
    }
    if (!state) {
      setStatus(vendor, 'err', 'OAuth state hết hạn — bấm lại button OAuth');
      return;
    }
    setBusy(vendor);
    setStatus(vendor, 'pending', 'Đang exchange code...');
    try {
      const r = await fetch(`/api/admin/integrations/oauth/${vendor}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, code }),
      });
      const d = await r.json();
      if (d.ok) {
        input.value = '';
        setOAuthVisible((s) => ({ ...s, [vendor]: false }));
        setStatus(vendor, 'ok', `✓ ${vendor} đã kết nối qua OAuth (dùng Pro/Max quota)`);
        refresh();
      } else {
        setStatus(vendor, 'err', `✗ ${d.error ?? 'Lỗi exchange'}`);
      }
    } catch (err) {
      setStatus(vendor, 'err', `✗ ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const onRevokeKey = async (vendor: string) => {
    if (!confirm(`Revoke ${vendor} API key?`)) return;
    await fetch(`/api/admin/integrations/keys/${vendor}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-[#B8923D]">Kết nối AI providers</h1>
        <p className="mt-2 text-sm opacity-70">
          Mỗi feature dùng vendor phù hợp (Vision → Gemini, Logic → GPT, Empathy → Claude). Keys
          lưu encrypted trong Cloudflare KV. Trang này yêu cầu admin login. Endpoint backend yêu
          cầu admin token (proxy server-side ẩn token).
        </p>
      </header>

      <div className="rounded-lg border border-amber-700/40 bg-amber-900/10 p-4 text-sm leading-relaxed">
        <b>Cách kết nối</b>: <b>Google Gemini</b> hỗ trợ OAuth (dùng quota Code Assist Standard).{' '}
        <b>Anthropic Claude</b> và <b>OpenAI GPT</b> chỉ API key — Anthropic disable OAuth cho
        Messages API third-party từ Feb 2026 (chỉ Claude Code/.ai được dùng), OpenAI Codex chỉ
        accept <code className="font-mono text-xs">localhost:1455</code> callback nên không
        web-paste được.
      </div>

      {VENDORS.map((v) => {
        const st = providers?.[v.id];
        const status = msg[v.id];
        return (
          <div key={v.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">{v.name}</h2>
              {st && (st.api_key || st.oauth) && (
                <span className="text-xs text-emerald-400">
                  {st.oauth && '🔐 OAuth'}
                  {st.oauth && st.api_key && ' + '}
                  {st.api_key && '🔑 API key'}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs opacity-60">
              Roles: {v.roles} — model {models[v.id] ?? v.model}
            </div>

            {v.oauth && (
              <div className="mt-4">
                <button
                  onClick={() => onOAuthStart(v.id)}
                  disabled={busy === v.id}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-500 disabled:opacity-50"
                >
                  🔐 {v.oauthLabel}
                </button>
                {oauthVisible[v.id] && (
                  <div className="mt-3 rounded-lg bg-zinc-950 p-3 text-xs">
                    <p className="opacity-80">{v.oauthHint}</p>
                    <div className="mt-2 flex gap-2">
                      <input
                        id={`oauth-code-${v.id}`}
                        type="text"
                        placeholder="paste OAuth code"
                        className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs"
                      />
                      <button
                        onClick={() => onOAuthExchange(v.id)}
                        disabled={busy === v.id}
                        className="rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-amber-500 disabled:opacity-50"
                      >
                        Exchange
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 text-xs opacity-60">
              <span>API key: tạo tại </span>
              <a className="text-amber-400 hover:underline" href={v.keyUrl} target="_blank" rel="noreferrer">
                {v.keyUrl.replace('https://', '')}
              </a>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                id={`key-${v.id}`}
                type="password"
                placeholder={v.keyHint}
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs"
              />
              <button
                onClick={() => onConnectKey(v.id)}
                disabled={busy === v.id}
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-500 disabled:opacity-50"
              >
                Connect
              </button>
              {st?.api_key && (
                <button
                  onClick={() => onRevokeKey(v.id)}
                  className="rounded-md border border-red-700 px-3 py-2 text-xs text-red-400 hover:bg-red-900/30"
                >
                  Revoke
                </button>
              )}
            </div>
            {status && (
              <div
                className={`mt-2 text-xs ${
                  status.kind === 'ok'
                    ? 'text-emerald-400'
                    : status.kind === 'err'
                      ? 'text-red-400'
                      : 'opacity-70'
                }`}
              >
                {status.text}
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-xl border border-amber-900/40 bg-zinc-900/30 p-5">
        <h2 className="text-lg font-semibold">Cloudflare Workers AI (default, free)</h2>
        <div className="mt-1 text-xs opacity-60">
          Llama 3.3 70B + Llama 3.2 vision — đã active, không cần key.
        </div>
        <div className="mt-2 text-xs opacity-60">
          Dùng làm fallback khi vendor key chưa set hoặc rate-limited.
        </div>
      </div>
    </div>
  );
}
