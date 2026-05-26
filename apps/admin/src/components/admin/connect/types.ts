/**
 * Wave 60.81.D — shared types for /connect components.
 *
 * Provider catalogue + connection state + Dialog action union. Pulled out
 * of page.tsx so the AdminTable consumer + DropdownMenu row-actions can
 * import without circular deps.
 */

export type ProviderCategory = 'ai' | 'oauth' | 'service' | 'native';

export interface ProviderCatalogueEntry {
  id: string;
  name: string;
  category: ProviderCategory;
  /** Short hint shown below the name. */
  hint: string;
  /** Optional OAuth flow — when present the Connect Dialog routes through
   * /api/admin/integrations/oauth/[vendor]/start. When absent, API-key flow. */
  oauth?: boolean;
  /** Documentation URL (external). */
  docUrl?: string;
  /** Optional fixed scopes string for display (OAuth providers). */
  scopes?: string;
}

export interface ProviderRow {
  id: string;
  name: string;
  category: ProviderCategory;
  status: 'connected' | 'disconnected' | 'failed';
  connected_by?: string | null;
  connected_at?: string | null;
  last_used?: string | null;
  scopes?: string | null;
  failures_24h?: number;
  hint?: string;
  docUrl?: string;
  oauth?: boolean;
}

export type ConnectAction =
  | { kind: 'connect'; provider: ProviderCatalogueEntry }
  | { kind: 'disconnect'; row: ProviderRow }
  | { kind: 'reauth'; row: ProviderRow }
  | { kind: 'scopes'; row: ProviderRow };

/**
 * Static catalogue — extracted from the original /connect page + Vault 107
 * §5.7. When a vendor row is missing from the worker `providers` response
 * the catalogue entry seeds a "disconnected" row so admins can connect new
 * vendors without backend bootstrapping.
 */
export const PROVIDER_CATALOGUE: ReadonlyArray<ProviderCatalogueEntry> = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: 'ai',
    hint: 'psychology · report · mentor · judge',
    docUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    category: 'ai',
    hint: 'logic · alignment',
    docUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    category: 'ai',
    hint: 'vision (palm / face)',
    oauth: true,
    docUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    category: 'native',
    hint: 'llama-3.3-70b · vision-11b (native, no key)',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'oauth',
    hint: 'Payments + subscriptions (USD)',
    oauth: true,
    scopes: 'read_write',
  },
  {
    id: 'sepay',
    name: 'SePay',
    category: 'service',
    hint: 'Webhook + payment intent (VNĐ)',
    docUrl: 'https://docs.sepay.vn',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'service',
    hint: 'Exception + perf + replay',
    docUrl: 'https://docs.sentry.io',
  },
  {
    id: 'posthog',
    name: 'PostHog',
    category: 'service',
    hint: 'Analytics + flags + recording',
    docUrl: 'https://posthog.com/docs',
  },
  {
    id: 'resend',
    name: 'Resend',
    category: 'service',
    hint: 'Transactional email',
    docUrl: 'https://resend.com/docs',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'oauth',
    hint: 'Deploy + edge config',
    oauth: true,
    scopes: 'deployment:write',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'oauth',
    hint: 'Postgres + auth + storage',
    oauth: true,
    scopes: 'read+write',
  },
  {
    id: 'langfuse',
    name: 'Langfuse',
    category: 'service',
    hint: 'LLM tracing + evals',
    docUrl: 'https://langfuse.com/docs',
  },
];
