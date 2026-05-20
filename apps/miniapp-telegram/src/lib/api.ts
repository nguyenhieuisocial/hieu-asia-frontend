import { createApiClient } from '@hieu-asia/api-client';

export const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // Phase 3: read Telegram initData hash, exchange for backend JWT.
  getAuthToken: () => null,
});
