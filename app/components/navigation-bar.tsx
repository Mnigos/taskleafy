import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar'

import { SignInButton } from './sign-in-button'
import { UserDropdown } from './user-dropdown'

import { auth } from '@app/auth'

export async function NavigationBar() {
  const session = await auth()

  return (
    <Navbar>
      <NavbarBrand className="text-primary font-bold">TaskLeafy</NavbarBrand>
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
