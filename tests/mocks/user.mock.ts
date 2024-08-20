import type { User } from 'next-auth'
import { mock } from 'vitest-mock-extended'

export const userMockFactory = (userId: string, name = 'John Doe') =>
  mock<Required<User>>({
    id: userId,
    name,
  })
