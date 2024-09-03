import Image from 'next/image'
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
      <NavbarBrand className="flex gap-2 font-bold text-primary">
        <Image
          src="/task-leafy-icon.png"
          width={32}
          height={32}
          alt="TaskLeafy"
        />
        TaskLeafy
      </NavbarBrand>
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
