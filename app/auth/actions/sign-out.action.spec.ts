import { signOut } from '../auth'

import { signOutAction } from './sign-out.action'

vi.mock('../auth')

describe('SignOutAction', () => {
  const signOutSpy = vi.mocked(signOut)

  test('should call signIn', async () => {
    await signOutAction()

    expect(signOutSpy).toHaveBeenCalled()
  })
})
