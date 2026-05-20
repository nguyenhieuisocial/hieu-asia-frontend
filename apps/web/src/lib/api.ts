/**
 * App-level API singleton. Wraps shared client with web app's auth getter
 * (Auth.js v5 — provider-less for now; returns null).
 */

import { createApiClient } from '@hieu-asia/api-client';

export const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // Phase 2: read session.accessToken once Auth.js providers are wired.
  getAuthToken: () => null,
});
