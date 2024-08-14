import type { NextAuthConfig } from 'next-auth'
import Discord from 'next-auth/providers/discord'

export const nextAuthConfig: NextAuthConfig = {
  providers: [Discord],
  callbacks: {
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user?.id) {
        token.id = user.id
      }

      return token
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
}
