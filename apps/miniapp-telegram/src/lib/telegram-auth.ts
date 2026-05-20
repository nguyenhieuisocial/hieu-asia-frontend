/**
 * Telegram WebApp auth — V1 client-side parsing only.
 *
 * Production: backend `POST /v1/auth/telegram` verifies `initData` HMAC
 * (per Telegram spec: HMAC-SHA-256 with secret = SHA-256(bot_token)), then
 * returns JWT. Frontend stores JWT in localStorage and attaches it.
 *
 * V1 mock: just parse `initDataUnsafe.user` from WebApp SDK. Do NOT trust
 * this for any backend operation.
 */

import { getWebApp } from './telegram-init';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

const JWT_KEY = 'hieu.miniapp.jwt';

export function readJwt(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(JWT_KEY);
}

export function writeJwt(jwt: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JWT_KEY, jwt);
}

export function clearJwt() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(JWT_KEY);
}

/**
 * Read the Telegram user from initData.
 * Returns null when not running inside Telegram (e.g. dev browser preview).
 */
export async function getTelegramUser(): Promise<TelegramUser | null> {
  const webApp = await getWebApp();
  if (!webApp) return null;
  const u = webApp.initDataUnsafe?.user;
  if (!u) return null;
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    username: u.username,
    language_code: u.language_code,
    photo_url: u.photo_url,
  };
}

/**
 * Exchange initData with backend → JWT.
 * V1: if backend unavailable, store a mock JWT derived from telegram_id
 * so api-client has something to attach.
 */
export async function exchangeInitDataForJwt(): Promise<string | null> {
  const webApp = await getWebApp();
  if (!webApp) return null;
  const initData = webApp.initData;
  if (!initData) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    // Mock JWT — base64 of "mock:<telegram_id>"
    const user = webApp.initDataUnsafe?.user;
    const mock = `mock.${btoa(`tg:${user?.id ?? 0}`)}.signature`;
    writeJwt(mock);
    return mock;
  }

  try {
    const res = await fetch(`${apiUrl}/v1/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_data: initData }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string };
    writeJwt(data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}
