import { createApiClient } from '@hieu-asia/api-client';
import { readJwt } from './telegram-auth';

export const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  getAuthToken: () => readJwt(),
});
