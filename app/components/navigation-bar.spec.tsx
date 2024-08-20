import { render, screen } from '@testing-library/react'
import type { Session } from 'next-auth'

import { NavigationBar } from './navigation-bar'

import { auth } from '@app/auth'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/auth')

describe('NavigationBar', () => {
  test('should match snapshot as logged out', async () => {
    const view = render(await NavigationBar())

    expect(view).toMatchSnapshot()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  test('should match snapshot as logged in', async () => {
    const name = 'John Doe'

    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: userMockFactory('1', name),
    } as Session)

    const view = render(await NavigationBar())

    expect(view).toMatchSnapshot()
    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
