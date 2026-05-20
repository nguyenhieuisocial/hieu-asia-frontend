/**
 * Zalo Pay integration (skeleton).
 *
 * V1 stub: returns a mock order id when SDK is unavailable so the dashboard
 * "upgrade" CTA still works in local dev.
 *
 * Phase 2: wire to backend `/v1/payments/zalopay/order` once it exists.
 */
import { createOrder } from 'zmp-sdk/apis';

export interface PurchaseResult {
  orderId: string;
  mock: boolean;
}

/**
 * The `mac` HMAC must be generated server-side using the Zalo Pay app secret —
 * never hard-coded in the Mini App bundle. Phase 2: replace this stub with a
 * `POST /v1/payments/zalopay/sign` call before invoking `createOrder`.
 */
async function fetchOrderMac(_amount: number, _desc: string): Promise<string> {
  // Placeholder — backend endpoint TBD. Returning empty string forces the
  // dev-mode mock branch below, which is the desired behaviour for V1.
  return '';
}

export async function purchaseReading(): Promise<PurchaseResult> {
  try {
    const mac = await fetchOrderMac(99000, 'Báo cáo Cẩm Nang Cuộc Đời');
    if (!mac) throw new Error('Missing server-signed mac');
    const order = await createOrder({
      desc: 'Báo cáo Cẩm Nang Cuộc Đời',
      item: [{ id: 'reading-v1', amount: 99000, quantity: 1 }],
      amount: 99000,
      mac,
    });
    return { orderId: order.orderId, mock: false };
  } catch (err) {
    console.warn('[zalo-payment] createOrder failed (dev mode):', err);
    return { orderId: `mock-${Date.now()}`, mock: true };
  }
}
