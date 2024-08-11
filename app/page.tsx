import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { redirect } from 'next/navigation'

import { SignInButton } from './auth/components/sign-in-button'
import { auth } from './auth'

export default async function HomePage() {
  const session = await auth()

  if (session?.user) redirect('/board')

  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <CardHeader className="text-3xl text-primary">TaskLeafy</CardHeader>

        <CardBody>
          Simplify your tasks management with this simple app.
        </CardBody>

        <CardFooter>
          <SignInButton />
        </CardFooter>
      </Card>
    </div>
  )
}
