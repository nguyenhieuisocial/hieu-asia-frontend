// Chốt canh MỘT bất biến bảo mật của thanh toán Zalo Pay: chữ ký `mac` phải do
// máy chủ ký, KHÔNG BAO GIỜ nằm trong bundle mini-app.
//
// Bundle mini-app là mã chạy trên máy người dùng — mọi chuỗi trong đó đều đọc
// được. Nhét app secret của Zalo Pay vào để `createOrder` "chạy được ngay" là
// cách hỏng cám dỗ nhất khi làm Phase 2, vì nó khiến luồng thanh toán trông
// như đã hoạt động. Chú thích trong `zalo-payment.ts` đã dặn điều này, nhưng
// chú thích không chặn được ai.
//
// Bài viết theo BẤT BIẾN, không theo hiện trạng: hôm nay `fetchOrderMac` còn
// là stub trả chuỗi rỗng nên `createOrder` chưa từng được gọi. Nếu chốt theo
// "phải trả mock" thì đến lúc Phase 2 làm ĐÚNG, bài này sẽ đỏ vì lý do sai.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('zmp-sdk/apis', () => ({
  createOrder: vi.fn(async () => ({ orderId: 'zp-real-order' })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // `console.warn` trong nhánh dev-mode là chủ ý, đừng để nó rác output test.
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

describe('purchaseReading', () => {
  it('KHÔNG BAO GIỜ gọi createOrder khi chưa có `mac` do máy chủ ký', async () => {
    const { createOrder } = await import('zmp-sdk/apis');
    const { purchaseReading } = await import('./zalo-payment');

    await purchaseReading();

    for (const call of vi.mocked(createOrder).mock.calls) {
      const arg = call[0] as { mac?: string } | undefined;
      expect(
        arg?.mac,
        'createOrder bị gọi với mac rỗng — đơn hàng sẽ bị Zalo Pay từ chối, ' +
          'hoặc tệ hơn là ai đó sắp hard-code secret vào bundle để "cho chạy"',
      ).toBeTruthy();
    }
  });

  it('luôn trả về một orderId dùng được, không ném lỗi ra UI', async () => {
    const { purchaseReading } = await import('./zalo-payment');
    const res = await purchaseReading();
    expect(typeof res.orderId).toBe('string');
    expect(res.orderId.length).toBeGreaterThan(0);
    expect(typeof res.mock).toBe('boolean');
  });

  it('SDK ném lỗi thì vẫn không làm sập nút mua', async () => {
    const { createOrder } = await import('zmp-sdk/apis');
    vi.mocked(createOrder).mockRejectedValueOnce(new Error('SDK offline'));
    const { purchaseReading } = await import('./zalo-payment');
    await expect(purchaseReading()).resolves.toBeTruthy();
  });
});

describe('nguồn: không có secret nào bị nhúng', () => {
  const src = readFileSync(
    fileURLToPath(new URL('./zalo-payment.ts', import.meta.url)),
    'utf8',
  );

  it('không gán `mac` bằng chuỗi hằng trong mã', () => {
    // Mã hiện dùng shorthand `mac,` — lấy giá trị từ biến. Bắt đúng dạng
    // `mac: 'abc'` / `mac = "abc"`, tức có người dán chữ ký vào bundle.
    expect(
      src,
      'có vẻ một chữ ký/secret đã bị hard-code vào mini-app bundle',
    ).not.toMatch(/\bmac\s*[:=]\s*['"][^'"]+['"]/);
  });

  // KHẲNG ĐỊNH DƯƠNG TÍNH: nếu ai xoá luôn phần lấy mac thì bài trên vẫn xanh
  // suông. Chốt rằng mã VẪN đang lấy mac qua một hàm rồi mới gọi createOrder.
  it('vẫn lấy `mac` qua hàm ký phía máy chủ trước khi gọi createOrder', () => {
    expect(src).toMatch(/fetchOrderMac\s*\(/);
    expect(src).toMatch(/createOrder\s*\(/);
  });
});
