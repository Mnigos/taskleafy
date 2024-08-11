import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar'

import { UserDropdown } from './user-dropdown'

import { SignInButton } from '@app/auth/components'
import { auth } from '@app/auth'

export async function NavigationBar() {
  const session = await auth()

  return (
    <Navbar>
      <NavbarBrand className="font-bold text-primary">TaskLeafy</NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <SignInButton />
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
