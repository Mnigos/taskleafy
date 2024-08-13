'use server'

import type { AddTask } from '@app/board/types'
import { auth } from '@app/auth'
import { prisma } from '@app/db'

export async function addTask(data: AddTask) {
  const session = await auth()

  if (!session?.user?.id) throw new Error('Not authenticated')

  return prisma.task.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })
}
