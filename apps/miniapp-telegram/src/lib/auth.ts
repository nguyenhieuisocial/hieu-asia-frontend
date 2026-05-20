/**
 * Auth.js v5 stub. Telegram Login provider sẽ thêm Phase 3 — validate
 * Telegram WebApp initData server-side, sau đó cấp JWT.
 */
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  trustHost: true,
  session: { strategy: 'jwt' },
});
