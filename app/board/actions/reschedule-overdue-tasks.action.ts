'use server'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'

export interface RescheduleOverdueTasksParams {
  dueDate: Date
}

export async function rescheduleOverdueTasks({
  dueDate,
}: RescheduleOverdueTasksParams) {
  const { id: userId } = await getServerUser()

  return prisma.task.updateMany({
    where: {
      dueDate: {
        lt: new Date(),
      },
      userId,
    },
    data: {
      dueDate,
    },
  })
}
