import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { nextAuthConfig } from './next-auth.config'

import { prisma } from '@app/db'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  ...nextAuthConfig,
})
