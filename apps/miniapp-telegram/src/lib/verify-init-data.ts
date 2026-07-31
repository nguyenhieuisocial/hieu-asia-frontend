/**
 * Xác minh `initData` của Telegram WebApp phía SERVER.
 *
 * Tách ra từ /api/auth/telegram (31/07/2026) để các route khác dùng lại — đây là
 * NGUỒN DANH TÍNH DUY NHẤT đáng tin của mini-app: chuỗi `initData` được Telegram
 * ký HMAC bằng bot token, nên server tự suy ra được người dùng mà KHÔNG cần tin
 * bất cứ giá trị nào máy khách gửi lên.
 *
 * Vì sao quan trọng: `initDataUnsafe.user.id` mà Telegram SDK phơi ra ở client
 * là GIẢ MẠO ĐƯỢC. Mọi route trả dữ liệu cá nhân phải suy danh tính từ hàm này,
 * tuyệt đối không nhận `user_id` do client khai.
 *
 * Thuật toán: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
import crypto from 'node:crypto';

export interface TgUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

/** Cửa sổ chống phát lại. Giữ đồng bộ với /api/auth/telegram. */
const MAX_AUTH_AGE_S = 86_400;

export function verifyInitData(
  initData: string,
  botToken: string,
): { ok: boolean; user?: TgUser } {
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

  // So sánh hằng thời gian để không rò rỉ qua thời gian phản hồi.
  let hashBuf: Buffer;
  let computedBuf: Buffer;
  try {
    hashBuf = Buffer.from(hash, 'hex');
    computedBuf = Buffer.from(computed, 'hex');
  } catch {
    return { ok: false };
  }
  if (hashBuf.length !== computedBuf.length) return { ok: false };
  if (!crypto.timingSafeEqual(hashBuf, computedBuf)) return { ok: false };

  const authDate = Number(params.get('auth_date'));
  if (!Number.isFinite(authDate)) return { ok: false };
  if (Math.floor(Date.now() / 1000) - authDate > MAX_AUTH_AGE_S) return { ok: false };

  const userJson = params.get('user');
  if (!userJson) return { ok: false };
  try {
    const user = JSON.parse(userJson) as TgUser;
    if (typeof user?.id !== 'number') return { ok: false };
    return { ok: true, user };
  } catch {
    return { ok: false };
  }
}

/**
 * Suy id người dùng đã-xác-minh từ `initData`, hoặc `null` nếu không chứng minh
 * được. Fail CLOSED — caller phải 401 khi nhận `null`, không được rơi về id do
 * client khai.
 */
export function verifiedUserIdFrom(initData: unknown, botToken: string | undefined): string | null {
  if (!botToken || typeof initData !== 'string' || !initData) return null;
  const r = verifyInitData(initData, botToken);
  return r.ok && r.user ? `tg_${r.user.id}` : null;
}
