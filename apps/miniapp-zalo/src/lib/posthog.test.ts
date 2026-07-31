// Chốt canh QUYỀN RIÊNG TƯ cho PostHog trong Zalo Mini App.
//
// VÌ SAO PHẢI CÓ: mini-app chạy NHÚNG bên trong Zalo — bối cảnh nhạy cảm. Ba
// lựa chọn trong `posthog.init` là quyết định riêng tư chứ không phải tinh
// chỉnh hiệu năng: tắt ghi hình phiên, tắt heatmap, tôn trọng Do-Not-Track.
// Chúng chỉ là ba dòng nằm giữa một object option dài chục dòng. Ai "dọn cho
// gọn", hay copy cấu hình từ apps/web sang, là mất — và mất TRONG IM LẶNG:
// không lỗi, không cảnh báo, chỉ là từ hôm đó phiên người dùng bị ghi hình.
//
// Bối cảnh: trước bản này `apps/miniapp-zalo` không có một bài test nào (script
// `test` chỉ `echo` một dòng chữ), nên cổng test trong CI của nó là hình thức.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

interface FakePostHog {
  init: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  identify: ReturnType<typeof vi.fn>;
  opt_in_capturing: ReturnType<typeof vi.fn>;
  opt_out_capturing: ReturnType<typeof vi.fn>;
}

vi.mock('posthog-js', () => {
  const ph = {} as FakePostHog;
  ph.init = vi.fn((_key: string, opts?: { loaded?: (p: FakePostHog) => void }) => {
    opts?.loaded?.(ph);
  });
  ph.register = vi.fn();
  ph.identify = vi.fn();
  ph.opt_in_capturing = vi.fn();
  ph.opt_out_capturing = vi.fn();
  return { default: ph };
});

/** Dựng một `window` tối thiểu — đủ cho isOptedOut + buildSuperProperties. */
function installWindow(prefs?: unknown): void {
  const store = new Map<string, string>();
  if (prefs !== undefined) {
    store.set('hieu.user.preferences', JSON.stringify(prefs));
  }
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
    screen: { width: 390, height: 844 },
    innerWidth: 390,
    innerHeight: 844,
    devicePixelRatio: 3,
    matchMedia: () => ({ matches: false }),
  };
}

async function load(): Promise<{
  ph: FakePostHog;
  mod: typeof import('./posthog');
}> {
  const ph = (await import('posthog-js')).default as unknown as FakePostHog;
  const mod = await import('./posthog');
  return { ph, mod };
}

/** Lấy object option đã truyền vào `posthog.init`. */
function initOptions(ph: FakePostHog): Record<string, unknown> {
  const call = ph.init.mock.calls[0];
  expect(call, 'posthog.init chưa hề được gọi').toBeTruthy();
  return (call as unknown[])[1] as Record<string, unknown>;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_test_key');
  installWindow();
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as unknown as { window?: unknown }).window;
});

describe('cấu hình riêng tư — thứ mất đi trong im lặng', () => {
  it('KHÔNG ghi hình phiên (mini-app nhúng trong Zalo)', async () => {
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(
      initOptions(ph).disable_session_recording,
      'ghi hình phiên bị bật lại — mini-app nhúng trong Zalo, tuyệt đối không',
    ).toBe(true);
  });

  it('KHÔNG bật heatmap', async () => {
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(initOptions(ph).enable_heatmaps).toBe(false);
  });

  it('tôn trọng Do-Not-Track của trình duyệt', async () => {
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(initOptions(ph).respect_dnt).toBe(true);
  });

  it('không ghi log console vào bản ghi', async () => {
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(initOptions(ph).enable_recording_console_log).toBe(false);
  });
});

describe('người dùng từ chối analytics', () => {
  it('prefs analytics_opt_in=false ⇒ gọi opt_out_capturing', async () => {
    installWindow({ privacy: { analytics_opt_in: false } });
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(
      ph.opt_out_capturing,
      'người dùng đã tắt analytics nhưng vẫn bị thu thập',
    ).toHaveBeenCalled();
  });

  // Mặt còn lại của chốt: nếu bài trên xanh vì opt_out LÚC NÀO CŨNG được gọi
  // thì nó không chứng minh gì cả.
  it('chưa khai prefs ⇒ KHÔNG tự ý opt-out', async () => {
    const { ph, mod } = await load();
    mod.getPostHog();
    expect(ph.opt_out_capturing).not.toHaveBeenCalled();
  });

  it('prefs hỏng (JSON rác) ⇒ không nổ, coi như chưa khai', async () => {
    (globalThis as unknown as { window: { localStorage: { getItem: () => string } } }).window = {
      localStorage: { getItem: () => '{{{ khong phai json' },
    };
    const { mod } = await load();
    expect(() => mod.getPostHog()).not.toThrow();
  });
});

describe('định danh người dùng — không để PII rò sang PostHog', () => {
  it('luôn gắn tiền tố `zalo:` chứ không dùng id trần', async () => {
    const { ph, mod } = await load();
    mod.userIdentify(123456);
    expect(ph.identify).toHaveBeenCalledWith('zalo:123456', {
      platform: 'zalo-miniapp',
    });
  });

  it('id rỗng thì không gọi identify', async () => {
    const { ph, mod } = await load();
    mod.userIdentify('');
    expect(ph.identify).not.toHaveBeenCalled();
  });

  it('không đính kèm email/phone vào thuộc tính identify', async () => {
    const { ph, mod } = await load();
    mod.userIdentify('u1');
    const props = ph.identify.mock.calls[0]?.[1] as Record<string, unknown>;
    const keys = Object.keys(props ?? {}).join(',');
    expect(keys, `identify đang mang PII: ${keys}`).not.toMatch(
      /email|phone|sdt|so_dien_thoai/i,
    );
  });
});

describe('thiếu khoá thì tắt hẳn, không nửa vời', () => {
  it('không có VITE_PUBLIC_POSTHOG_KEY ⇒ trả null và KHÔNG init', async () => {
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', '');
    const { ph, mod } = await load();
    expect(mod.getPostHog()).toBeNull();
    expect(ph.init).not.toHaveBeenCalled();
  });
});

describe('bẫy Vite: tiền tố biến môi trường', () => {
  // `zmp build` dùng Vite, KHÔNG phải Next.js. Vite chỉ inline biến có tiền tố
  // `VITE_`. Ai đổi sang `NEXT_PUBLIC_` (theo thói quen từ apps/web) thì giá trị
  // thành undefined ⇒ getPostHog() lặng lẽ trả null ⇒ analytics chết mà không
  // ai biết, vì nhánh "thiếu khoá" cố tình im lặng.
  const src = readFileSync(
    fileURLToPath(new URL('./posthog.ts', import.meta.url)),
    'utf8',
  );

  it('không đọc `import.meta.env.NEXT_PUBLIC_*`', () => {
    expect(src).not.toMatch(/import\.meta\.env\.NEXT_PUBLIC_/);
  });

  // KHẲNG ĐỊNH DƯƠNG TÍNH — thiếu dòng này thì xoá sạch phần đọc khoá bài trên
  // vẫn xanh, tức chốt tự vô hiệu.
  it('có đọc `import.meta.env.VITE_PUBLIC_POSTHOG_KEY`', () => {
    expect(src).toMatch(/import\.meta\.env\.VITE_PUBLIC_POSTHOG_KEY/);
  });
});
