import type { User } from 'next-auth'
import { mock } from 'vitest-mock-extended'

export const userMockFactory = (userId: string) =>
  mock<Required<User>>({
    id: userId,
  })
