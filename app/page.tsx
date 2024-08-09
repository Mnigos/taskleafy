import { Button } from '@nextui-org/button'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'

import { signIn } from './auth'

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader className="text-3xl text-primary">Taskleafy</CardHeader>

        <CardBody>
          Simplify your tasks management with this simple app.
        </CardBody>

        <CardFooter>
          <form
            action={async () => {
              'use server'

              await signIn()
            }}
          >
            <Button color="primary" type="submit">
              Sign in
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}
