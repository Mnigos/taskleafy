import { Button } from '@nextui-org/button'

import { signInAction } from '@app/auth/actions'

export function SignInButton() {
  return (
    <form action={signInAction}>
      <Button color="primary" type="submit">
        Sign in
      </Button>
    </form>
  )
}
