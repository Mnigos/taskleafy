'use server'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'

export async function getTasks() {
  const user = await getServerUser()

  return prisma.task.findMany({
    where: {
      userId: user.id,
    },
  })
}
