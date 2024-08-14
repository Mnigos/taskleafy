'use server'

import type { Task } from '@prisma/client'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'

export interface UpdateTaskParams {
  id: Task['id']
  data: Omit<Partial<Task>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
}

export async function updateTask({ id, data }: UpdateTaskParams) {
  await getServerUser()

  return prisma.task.update({
    where: {
      id,
    },
    data,
  })
}
