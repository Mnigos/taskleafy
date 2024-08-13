'use server'

import { redirect } from 'next/navigation'

import { auth } from '@app/auth'
import { prisma } from '@app/db'

export async function getTasks() {
  const session = await auth()

  if (!session?.user?.id) redirect('/')

  return prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
  })
}
