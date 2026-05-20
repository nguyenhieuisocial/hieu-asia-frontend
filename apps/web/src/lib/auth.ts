/**
 * Auth.js v5 (NextAuth) stub. No providers wired yet — Phase 2 adds:
 *   - Telegram Login
 *   - Email magic link
 *   - Possibly Google OAuth
 *
 * Keep config in this single file so route handlers and middleware can import.
 */

import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  // Allow Next 15 + Edge runtime
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
});
