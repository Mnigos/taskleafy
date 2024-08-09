import type { NextAuthConfig } from 'next-auth'
import Discord from 'next-auth/providers/discord'

export const nextAuthConfig: NextAuthConfig = {
  providers: [Discord],
}
