'use client';

import * as React from 'react';

const ZODIACS: { key: string; label: string; icon: string }[] = [
  { key: 'ty', label: 'Tý', icon: '🐭' },
  { key: 'suu', label: 'Sửu', icon: '🐂' },
  { key: 'dan', label: 'Dần', icon: '🐯' },
  { key: 'mao', label: 'Mão', icon: '🐰' },
  { key: 'thin', label: 'Thìn', icon: '🐲' },
  { key: 'ty2', label: 'Tỵ', icon: '🐍' },
  { key: 'ngo', label: 'Ngọ', icon: '🐴' },
  { key: 'mui', label: 'Mùi', icon: '🐐' },
  { key: 'than', label: 'Thân', icon: '🐵' },
  { key: 'dau', label: 'Dậu', icon: '🐓' },
  { key: 'tuat', label: 'Tuất', icon: '🐶' },
  { key: 'hoi', label: 'Hợi', icon: '🐷' },
];

const LS_USER = 'hieu.daily.user_id';
const LS_ZODIAC = 'hieu.daily.zodiac';
const LS_SUBBED = 'hieu.daily.browser_subscribed';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function ensureUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(LS_USER);
  if (!id) {
    id = `web-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    localStorage.setItem(LS_USER, id);
  }
  return id;
}

export interface SubscribePushProps {
  defaultZodiac?: string;
  vapidPublicKey?: string;
}

export function SubscribePush({ defaultZodiac, vapidPublicKey }: SubscribePushProps) {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [zodiac, setZodiac] = React.useState<string>(defaultZodiac ?? '');
  const [subscribed, setSubscribed] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ok = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
    setSupported(ok);
    if (!ok) return;
    const savedZ = localStorage.getItem(LS_ZODIAC);
    if (savedZ && !zodiac) setZodiac(savedZ);
    if (localStorage.getItem(LS_SUBBED) === '1') setSubscribed(true);
  }, []);

  async function handleSubscribe() {
    setMessage(null);
    if (!zodiac) {
      setMessage('Vui lòng chọn tuổi của bạn.');
      return;
    }
    if (!supported) {
      setMessage('Trình duyệt không hỗ trợ web push.');
      return;
    }
    setBusy(true);
    try {
      // Register SW
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // Permission
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setMessage('Bạn chưa cho phép thông báo.');
        setBusy(false);
        return;
      }

      // Subscribe — VAPID key optional, falls back to non-restricted endpoint.
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const opts: PushSubscriptionOptionsInit = { userVisibleOnly: true };
        if (vapidPublicKey) {
          // Cast to satisfy DOM types — Uint8Array is a valid BufferSource at runtime.
          opts.applicationServerKey = urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource;
        }
        sub = await reg.pushManager.subscribe(opts);
      }

      const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh: string; auth: string } };
      const userId = ensureUserId();
      localStorage.setItem(LS_ZODIAC, zodiac);

      const resp = await fetch('/api/daily/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          zodiac,
          channel: 'browser',
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`subscribe failed: ${resp.status} ${txt}`);
      }
      localStorage.setItem(LS_SUBBED, '1');
      setSubscribed(true);
      setMessage('Đã đăng ký, hẹn gặp 6h sáng mai.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleUnsubscribe() {
    setMessage(null);
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      const userId = ensureUserId();
      await fetch('/api/daily/push/unsubscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: userId, channel: 'browser' }),
      });
      localStorage.removeItem(LS_SUBBED);
      setSubscribed(false);
      setMessage('Đã hủy đăng ký.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (supported === false) {
    return (
      <div className="rounded-xl border border-cream/10 bg-ink/40 p-4 text-sm text-cream/70">
        Trình duyệt của bạn chưa hỗ trợ thông báo web push. Hãy dùng Chrome, Edge, hoặc Firefox để nhận tử vi mỗi sáng.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-heading text-lg font-semibold text-cream">
            Nhận tử vi mỗi sáng 6h
          </div>
          <p className="mt-1 text-sm text-cream/70">
            Mỗi ngày một thông báo ngắn cho tuổi của bạn.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
            disabled={busy || subscribed}
            className="rounded-lg border border-cream/15 bg-ink/60 px-3 py-2 text-sm text-cream"
          >
            <option value="">Chọn tuổi…</option>
            {ZODIACS.map((z) => (
              <option key={z.key} value={z.key}>
                {z.icon} Tuổi {z.label}
              </option>
            ))}
          </select>
          {subscribed ? (
            <button
              onClick={handleUnsubscribe}
              disabled={busy}
              className="rounded-lg border border-cream/20 px-4 py-2 text-sm text-cream/80 transition hover:border-rose-400/60 hover:text-rose-300 disabled:opacity-50"
            >
              {busy ? '…' : 'Hủy'}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={busy || !zodiac}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold/90 disabled:opacity-50"
            >
              {busy ? '…' : 'Nhận thông báo'}
            </button>
          )}
        </div>
      </div>
      {message ? (
        <div className="mt-3 text-sm text-cream/80">{message}</div>
      ) : null}
    </div>
  );
}
