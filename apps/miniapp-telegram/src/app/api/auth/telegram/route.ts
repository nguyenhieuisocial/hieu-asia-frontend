/**
 * POST /api/auth/telegram
 *
 * Verify Telegram WebApp `initData` HMAC server-side, then upsert user into
 * Supabase. This is the gate that prevents fake `telegram_id` from the client.
 *
 * HMAC algorithm per https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *   1. Parse `initData` querystring.
 *   2. Pop `hash`. Sort remaining pairs by key, join `k=v` with `\n`.
 *   3. secret_key = HMAC_SHA256(key="WebAppData", msg=BOT_TOKEN)
 *   4. computed  = HMAC_SHA256(key=secret_key,   msg=dataCheckString) as hex
 *   5. Match against `hash`.
 *
 * Pattern mirrors backend/infra/supabase/functions/telegram-webhook/index.ts:upsertUser.
 */
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface TgUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

function verifyInitData(initData: string, botToken: string): { ok: boolean; user?: TgUser } {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false };
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // Constant-time compare to avoid timing leaks.
  const hashBuf = Buffer.from(hash, 'hex');
  const computedBuf = Buffer.from(computed, 'hex');
  if (hashBuf.length !== computedBuf.length) return { ok: false };
  if (!crypto.timingSafeEqual(hashBuf, computedBuf)) return { ok: false };

  // Auth date freshness — reject anything older than 24h to limit replay.
  const authDate = Number(params.get('auth_date'));
  if (!Number.isFinite(authDate)) return { ok: false };
  const nowSec = Math.floor(Date.now() / 1000);
  if (nowSec - authDate > 86_400) return { ok: false };

  const userJson = params.get('user');
  let user: TgUser | undefined;
  if (userJson) {
    try {
      user = JSON.parse(userJson) as TgUser;
    } catch {
      return { ok: false };
    }
  }
  return { ok: true, user };
}

async function upsertUser(tgUser: TgUser): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return false;
  const userId = `tg_${tgUser.id}`;
  const nowIso = new Date().toISOString();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?on_conflict=id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'resolution=merge-duplicates',
        'Content-Profile': 'hieu_asia',
      },
      body: JSON.stringify({
        id: userId,
        telegram_id: String(tgUser.id),
        plan: 'free',
        created_at: nowIso,
        last_active: nowIso,
      }),
    });
    if (!res.ok) {
      console.error('upsertUser failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('upsertUser error:', e);
    return false;
  }
}

export async function POST(req: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json({ ok: false, error: 'bot_token_missing' }, { status: 500 });
  }
  let body: { initData?: string };
  try {
    body = (await req.json()) as { initData?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const initData = body.initData;
  if (!initData || typeof initData !== 'string') {
    return NextResponse.json({ ok: false, error: 'init_data_missing' }, { status: 400 });
  }

  const { ok, user } = verifyInitData(initData, BOT_TOKEN);
  if (!ok || !user) {
    return NextResponse.json({ ok: false, error: 'invalid_init_data' }, { status: 401 });
  }

  // Fire-and-forget shape for upsert — don't fail auth if Supabase is down.
  const upserted = await upsertUser(user);

  return NextResponse.json({
    ok: true,
    user_id: `tg_${user.id}`,
    upserted,
    user: {
      id: user.id,
      first_name: user.first_name,
      username: user.username,
    },
  });
}
