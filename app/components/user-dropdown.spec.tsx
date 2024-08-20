import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UserDropdown } from './user-dropdown'

import { userMockFactory } from '@tests/mocks'
import { signOutAction } from '@app/auth/actions'

vi.mock('@app/auth/actions')

describe('UserDropdown', () => {
  const name = 'John Doe'

  test('should match snapshot', () => {
    const view = render(<UserDropdown user={userMockFactory('1')} />)

    expect(view).toMatchSnapshot()
  })

  test('should call signOutAction on click', async () => {
    const user = userEvent.setup()

    const signOutSpy = vi.mocked(signOutAction)

    render(<UserDropdown user={userMockFactory('1', name)} />)

    await user.click(screen.getByText(name))
    await user.click(screen.getByText('Sign out'))

    expect(signOutSpy).toHaveBeenCalled()
  })
})
