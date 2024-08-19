import { signIn } from '../auth'

import { signInAction } from './sign-in.action'

vi.mock('../auth')

describe('SignInAction', () => {
  const signInSpy = vi.mocked(signIn)

  test('should call signIn', async () => {
    await signInAction()

    expect(signInSpy).toHaveBeenCalled()
  })
})
