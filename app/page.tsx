import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { redirect } from 'next/navigation'

import { SignInButton } from './components/sign-in-button'
import { auth } from './auth'

export default async function HomePage() {
  const session = await auth()

  if (session?.user) redirect('/board')

  return (
    <main className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader className="text-3xl text-primary">TaskLeafy</CardHeader>

        <CardBody>
          Simplify your tasks management with this simple app.
        </CardBody>

        <CardFooter>
          <SignInButton />
        </CardFooter>
      </Card>
    </main>
  )
}
