'use server'

import { getServerUser } from '@app/auth/helpers'
import type { AddTask } from '@app/board/types'
import { prisma } from '@app/db'

export async function addTask(data: AddTask) {
  const user = await getServerUser()

  return prisma.task.create({
    data: {
      ...data,
      userId: user.id,
    },
  })
}
