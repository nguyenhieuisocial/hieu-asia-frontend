/**
 * Zalo SDK init helpers.
 *
 * All calls are best-effort: when the app runs outside the official Zalo
 * client (e.g. local Vite dev), `zmp-sdk` calls reject — we fall back to a
 * synthetic guest profile so the V1 flow stays usable.
 */
import { authorize, getUserInfo } from 'zmp-sdk/apis';

export interface ZaloUser {
  id: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

export async function initZalo(): Promise<ZaloUser> {
  try {
    await authorize({ scopes: ['scope.userInfo'] });
    const info = await getUserInfo({ avatarType: 'normal' });
    const u = info.userInfo;
    return {
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      isGuest: false,
    };
  } catch (err) {
    // Likely running outside Zalo client — fall through to guest mode.
    console.warn('[zalo-init] authorize failed, using guest profile:', err);
    return {
      id: `guest-${Math.random().toString(36).slice(2, 10)}`,
      name: 'Khách',
      isGuest: true,
    };
  }
}
