'use client'

import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import type { User } from 'next-auth'

import { signOutAction } from '@app/auth/actions'

namespace UserDropdown {
  export type Props = Readonly<{
    user: User
  }>
}

function UserDropdown({ user }: UserDropdown.Props) {
  const items = [
    {
      key: 'sign-out',
      label: 'Sign out',
    },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="flex items-center gap-2" variant="bordered">
          <p>{user.name}</p>

          <Avatar
            classNames={{
              img: 'opacity-100',
            }}
            size="sm"
            src={user.image ?? undefined}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu items={items}>
        {item => (
          <DropdownItem
            key={item.key}
            color={item.key === 'sign-out' ? 'danger' : 'default'}
            className={item.key === 'sign-out' ? 'text-danger' : ''}
            onClick={() => signOutAction()}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export { UserDropdown }
