// Chốt canh CỬA XÁC THỰC của mini-app Telegram.
//
// `verifyInitData` là thứ duy nhất ngăn một người bịa `telegram_id` của người
// khác. Hỏng nó không gây lỗi, không gây chậm, không ai thấy gì — chỉ là từ
// hôm đó bất kỳ ai POST một chuỗi tự chế cũng đăng nhập được vào tài khoản bất
// kỳ. Đúng kiểu hỏng mà chỉ test mới bắt được.
//
// Các nhánh dễ hỏng nhất khi ai đó "dọn dẹp": bỏ so sánh thời-gian-hằng, bỏ
// kiểm tra `auth_date` (mở đường replay), hoặc bắt lỗi rồi cho qua khi
// `Buffer.from(hash,'hex')` ra độ dài lạ.
//
// Bối cảnh: trước bản này `apps/miniapp-telegram` không có bài test nào (script
// `test` chỉ `echo`), nên cổng test trong CI của nó là hình thức.
import { createHmac } from 'node:crypto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const BOT_TOKEN = '123456:TEST-BOT-TOKEN';
const ENV_KEYS = ['TELEGRAM_BOT_TOKEN', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

let saved: Record<string, string | undefined> = {};

beforeEach(async () => {
  saved = {};
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  // Cố ý KHÔNG đặt SUPABASE_* — upsertUser thoát sớm, không chạm mạng.
  process.env.TELEGRAM_BOT_TOKEN = BOT_TOKEN;
  const { vi } = await import('vitest');
  vi.resetModules();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

/** Ký initData đúng thuật toán Telegram (bản độc lập với mã đang test). */
function sign(fields: Record<string, string>, botToken: string = BOT_TOKEN): string {
  const params = new URLSearchParams(fields);
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  params.set('hash', hash);
  return params.toString();
}

function fields(over: Record<string, string> = {}): Record<string, string> {
  return {
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: 'AAE-test',
    user: JSON.stringify({ id: 42, first_name: 'Hieu', username: 'hieu' }),
    ...over,
  };
}

async function post(
  body: unknown,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const { POST } = await import('./route');
  const req = new Request('http://localhost/api/auth/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  const res = await POST(req);
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

describe('chữ ký hợp lệ thì cho qua', () => {
  it('initData ký đúng ⇒ 200 và user_id gắn tiền tố tg_', async () => {
    const { status, json } = await post({ initData: sign(fields()) });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.user_id).toBe('tg_42');
  });

  // Ý đồ ghi rõ trong mã: Supabase chết thì KHÔNG được kéo sập đăng nhập.
  it('Supabase chưa cấu hình vẫn đăng nhập được, chỉ báo upserted=false', async () => {
    const { status, json } = await post({ initData: sign(fields()) });
    expect(status).toBe(200);
    expect(json.upserted).toBe(false);
  });
});

describe('chữ ký sai thì CHẶN — đây là toàn bộ lý do cửa này tồn tại', () => {
  it('sửa dữ liệu sau khi ký ⇒ 401', async () => {
    const good = sign(fields());
    const tampered = good.replace('Hieu', 'Hacker');
    expect(tampered, 'ca test tự hỏng: chuỗi không hề bị sửa').not.toBe(good);
    const { status, json } = await post({ initData: tampered });
    expect(status).toBe(401);
    expect(json.error).toBe('invalid_init_data');
  });

  it('ký bằng bot token khác ⇒ 401 (không thì ai cũng giả được telegram_id)', async () => {
    const forged = sign(fields(), '999999:ATTACKER-TOKEN');
    const { status } = await post({ initData: forged });
    expect(status).toBe(401);
  });

  it('thiếu hash ⇒ 401', async () => {
    const params = new URLSearchParams(fields());
    const { status } = await post({ initData: params.toString() });
    expect(status).toBe(401);
  });

  it('hash sai độ dài ⇒ 401, không ném lỗi', async () => {
    const params = new URLSearchParams(fields());
    params.set('hash', 'ab');
    const { status } = await post({ initData: params.toString() });
    expect(status).toBe(401);
  });

  it('hash không phải hex ⇒ 401, không ném lỗi', async () => {
    const params = new URLSearchParams(fields());
    params.set('hash', 'zzzz-khong-phai-hex');
    const { status } = await post({ initData: params.toString() });
    expect(status).toBe(401);
  });
});

describe('chống phát lại (replay)', () => {
  it('auth_date quá 24 giờ ⇒ 401', async () => {
    const old = String(Math.floor(Date.now() / 1000) - 86_401);
    const { status } = await post({ initData: sign(fields({ auth_date: old })) });
    expect(status).toBe(401);
  });

  it('auth_date vẫn trong 24 giờ ⇒ cho qua (chốt không quá tay)', async () => {
    const recent = String(Math.floor(Date.now() / 1000) - 3_600);
    const { status } = await post({ initData: sign(fields({ auth_date: recent })) });
    expect(status).toBe(200);
  });

  it('auth_date không phải số ⇒ 401', async () => {
    const { status } = await post({ initData: sign(fields({ auth_date: 'hom-qua' })) });
    expect(status).toBe(401);
  });
});

describe('dữ liệu người dùng hỏng thì không cho qua nửa vời', () => {
  it('user không parse được ⇒ 401 dù chữ ký đúng', async () => {
    const { status } = await post({ initData: sign(fields({ user: '{{{ rac' })) });
    expect(status).toBe(401);
  });

  it('không có trường user ⇒ 401 (không tạo phiên rỗng)', async () => {
    const f = fields();
    delete (f as { user?: string }).user;
    const { status } = await post({ initData: sign(f) });
    expect(status).toBe(401);
  });
});

describe('đầu vào rác', () => {
  it('body không phải JSON ⇒ 400', async () => {
    const { status, json } = await post('khong phai json');
    expect(status).toBe(400);
    expect(json.error).toBe('invalid_json');
  });

  it('thiếu initData ⇒ 400', async () => {
    const { status, json } = await post({});
    expect(status).toBe(400);
    expect(json.error).toBe('init_data_missing');
  });

  it('initData không phải chuỗi ⇒ 400', async () => {
    const { status } = await post({ initData: 12345 });
    expect(status).toBe(400);
  });
});

describe('thiếu cấu hình máy chủ', () => {
  it('không có TELEGRAM_BOT_TOKEN ⇒ 500, KHÔNG âm thầm cho qua', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const { vi } = await import('vitest');
    vi.resetModules();
    const { status, json } = await post({ initData: sign(fields()) });
    expect(status).toBe(500);
    expect(json.error).toBe('bot_token_missing');
  });
});
