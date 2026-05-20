import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  trustHost: true,
  session: { strategy: 'jwt' },
});
