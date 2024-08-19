import type { Session } from 'next-auth'
import { mock } from 'vitest-mock-extended'

import { auth } from '../auth'

import { getServerUser } from './get-server-user'

vi.mock('../auth')

describe('getServerUser', () => {
  test('should redirect if no session', async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue(null)

    await expect(getServerUser()).rejects.toThrow()
  })

  test('should return user if session', async () => {
    const session = mock<Session>({
      user: {
        id: '1',
        name: 'John Doe',
      },
    })

    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue(session)

    const user = await getServerUser()

    expect(user).toEqual(session.user)
  })
})
