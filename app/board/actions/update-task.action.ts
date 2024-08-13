'use server'

import type { Task } from '@prisma/client'

import { auth } from '@app/auth'
import { prisma } from '@app/db'

export interface UpdateTaskParams {
  id: Task['id']
  data: Omit<Partial<Task>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
}

export async function updateTask({ id, data }: UpdateTaskParams) {
  const session = await auth()

  if (!session?.user?.id) throw new Error('Not authenticated')

  console.log(data)

  return prisma.task.update({
    where: {
      id,
    },
    data,
  })
}
