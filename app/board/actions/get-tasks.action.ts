'use server'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'

export async function getTasks() {
  const { id: userId } = await getServerUser()

  return prisma.task.findMany({
    where: {
      userId,
    },
  })
}
