import type { DefaultSession, User } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    id: string
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    token: {
      id: string
    }
    user?: Required<User>
  }
}
