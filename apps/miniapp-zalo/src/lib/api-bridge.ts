/**
 * Shared API client wired with Zalo bearer-token resolver.
 *
 * Mini Apps don't have a Next.js process.env at runtime — Vite injects
 * `import.meta.env`. We honour `VITE_API_URL` and default to localhost.
 */
import { createApiClient } from '@hieu-asia/api-client';
import { getZaloAccessToken } from './zalo-auth';

const baseUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

export const apiClient = createApiClient({
  baseUrl,
  getAuthToken: () => getZaloAccessToken(),
});
