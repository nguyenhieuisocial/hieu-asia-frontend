/**
 * Wave 55 — Vercel BotID client initialization.
 *
 * Loads on every page navigation (Next.js 15.3+ convention). Attaches the
 * BotID classification headers to outgoing requests that match the `protect`
 * list, so the server-side `checkBotId()` can verify the request signal.
 *
 * Currently guards the highest-fraud-risk endpoints:
 *   - POST /api/payment/intent  → creates a SEPAY QR for VND payment
 *
 * To extend protection, add more `{ path, method }` entries here AND call
 * `await checkBotId()` at the start of the corresponding route handler.
 * Both sides must agree — adding only one side is a no-op.
 *
 * BotID is a Vercel Pro feature; in non-Vercel preview/dev the client is a
 * silent no-op (the script tag still attaches, but classification is skipped).
 */

import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    {
      // Wave 55 BUG-A territory: payment creation. Each call mints a SEPAY
      // QR + records an intent row. Bots could otherwise hammer this to
      // exhaust quota or grief the audit log.
      path: '/api/payment/intent',
      method: 'POST',
    },
    {
      // Wave 56 — reasoning routes call AI Gateway per request. Each LLM
      // call costs real money + counts toward provider rate limits. Bot
      // abuse here would drain budget without producing legitimate output.
      // Wildcard covers /api/reasoning/* (hello pilot + Phase 2+ graphs).
      path: '/api/reasoning/*',
      method: 'POST',
    },
  ],
});
