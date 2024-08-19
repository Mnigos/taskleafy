'use server'

import type { Task } from '@prisma/client'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'

export async function getTask(id: Task['id']) {
  const { id: userId } = await getServerUser()

  return prisma.task.findUnique({
    where: {
      id,
      userId,
    },
  })
}
