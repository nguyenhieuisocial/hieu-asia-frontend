/**
 * Zalo access-token getter, plugged into `@hieu-asia/api-client`.
 *
 * Phase 3: validate token server-side, exchange for backend JWT.
 * For V1 we forward the raw Zalo access token as a bearer, or null when
 * SDK is unavailable (dev mode).
 */
import { getAccessToken } from 'zmp-sdk/apis';

export async function getZaloAccessToken(): Promise<string | null> {
  try {
    const token = await getAccessToken({});
    return token ?? null;
  } catch (err) {
    console.warn('[zalo-auth] getAccessToken failed:', err);
    return null;
  }
}
