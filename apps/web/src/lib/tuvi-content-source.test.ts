/**
 * GHIM lời hứa an toàn của CMS Tử Vi bước 3: **web không bao giờ tệ hơn bản trong
 * code**, dù DB lỗi / trả rỗng / thiếu trường.
 *
 * Đây là nội dung SEO chính (12 cung + 47 sao đã lên chỉ mục). Nếu một lần sửa
 * nhầm trong admin làm trắng một trường, hoặc API 502, mà web hiển thị theo DB thì
 * trang sẽ mỏng đi — thiệt hại thật và rất khó phát hiện. Test này canh đúng chỗ đó.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PALACES_CONTENT, ALL_STARS_CONTENT } from './tuvi-content';
import { getPalace, getPalaces, getStars } from './tuvi-content-source';

const CODE_MENH = PALACES_CONTENT.find((p) => p.slug === 'cung-menh')!;

/** Giả API worker: `rows = null` ⇒ mô phỏng API sập / trả lỗi. */
function mockApi(rows: unknown[] | null, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      ok
        ? new Response(JSON.stringify({ ok: true, items: rows ?? [] }), { status: 200 })
        : new Response('boom', { status: 502 }),
    ),
  );
}

afterEach(() => vi.restoreAllMocks());

describe('tuvi-content-source — DB trước, code dự phòng', () => {
  it('API sập (502) → trả nguyên bản trong code, KHÔNG rỗng', async () => {
    mockApi(null, false);
    const palaces = await getPalaces();
    expect(palaces).toHaveLength(PALACES_CONTENT.length);
    expect(palaces.find((p) => p.slug === 'cung-menh')).toEqual(CODE_MENH);
  });

  it('API lỗi mạng (throw) → vẫn trả bản code', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNRESET'); }));
    const stars = await getStars();
    expect(stars).toHaveLength(ALL_STARS_CONTENT.length);
  });

  it('DB trả danh sách rỗng → trả bản code (không xoá trang nào)', async () => {
    mockApi([]);
    expect(await getPalaces()).toHaveLength(PALACES_CONTENT.length);
  });

  it('DB sửa 1 trường → trường đó theo DB, các trường khác GIỮ bản code', async () => {
    mockApi([{ slug: 'cung-menh', title: CODE_MENH.name, data: { overview: 'BẢN SỬA TỪ ADMIN' } }]);
    const p = (await getPalace('cung-menh'))!;
    expect(p.overview).toBe('BẢN SỬA TỪ ADMIN');
    // Các trường DB không gửi phải còn nguyên — đây là lớp chống mất nội dung.
    expect(p.howToRead).toEqual(CODE_MENH.howToRead);
    expect(p.faq).toEqual(CODE_MENH.faq);
    expect(p.fullName).toBe(CODE_MENH.fullName);
  });

  it('DB trả trường TRẮNG / mảng RỖNG → KHÔNG ghi đè (giữ bản code)', async () => {
    mockApi([
      { slug: 'cung-menh', title: '   ', data: { overview: '', howToRead: [], faq: [], domain: '  ' } },
    ]);
    const p = (await getPalace('cung-menh'))!;
    expect(p.overview).toBe(CODE_MENH.overview);
    expect(p.howToRead).toEqual(CODE_MENH.howToRead);
    expect(p.faq).toEqual(CODE_MENH.faq);
    expect(p.domain).toBe(CODE_MENH.domain);
    expect(p.name).toBe(CODE_MENH.name);
  });

  it('giữ ĐỘ PHỦ + THỨ TỰ của bản code (SEO phụ thuộc), mục chỉ-có-DB xếp cuối', async () => {
    mockApi([
      { slug: 'cung-menh', title: 'Mệnh', data: { overview: 'x' } },
      { slug: 'cung-founder-tu-them', title: 'Cung mới', data: { overview: 'nội dung mới' } },
    ]);
    const palaces = await getPalaces();
    expect(palaces).toHaveLength(PALACES_CONTENT.length + 1);
    expect(palaces.slice(0, PALACES_CONTENT.length).map((p) => p.slug)).toEqual(
      PALACES_CONTENT.map((p) => p.slug),
    );
    expect(palaces[palaces.length - 1]?.slug).toBe('cung-founder-tu-them');
  });

  it('mục chỉ-có-DB mà rỗng ruột thì BỎ (không tạo trang trắng)', async () => {
    mockApi([{ slug: 'rong-ruot', title: 'Rỗng', data: {} }]);
    const palaces = await getPalaces();
    expect(palaces.some((p) => p.slug === 'rong-ruot')).toBe(false);
  });
});
