import { render } from '@testing-library/react'

import { SignInButton } from './sign-in-button'

describe('SignInButton', () => {
  test('should match snapshot', () => {
    const view = render(<SignInButton />)

    expect(view).toMatchSnapshot()
  })
})
