/**
 * Native Zalo share sheet wrapper.
 *
 * Falls back to `navigator.clipboard` when running outside Zalo so the
 * "Chia sẻ" button is never a dead-end.
 */
import { openShareSheet } from 'zmp-sdk/apis';

/**
 * Open native Zalo share sheet. `title` only takes effect on the `zmp` /
 * `zmp_deep_link` variants; on a plain `link` Zalo strips it and renders
 * a preview from the target page's OG tags.
 */
export async function shareReport(url: string, _title = 'Báo cáo của tôi - hieu.asia'): Promise<void> {
  try {
    await openShareSheet({ type: 'link', data: { link: url } });
  } catch (err) {
    console.warn('[zalo-share] openShareSheet failed, falling back to clipboard:', err);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* swallow — nothing more we can do */
    }
  }
}
