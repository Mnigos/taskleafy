'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@app/auth'
import { prisma } from '@app/db'

export async function markTaskAsDoneAction(taskId: string) {
  const session = await auth()

  if (!session?.user?.id) throw new Error('Not authenticated')

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isDone: true,
    },
  })

  revalidatePath('/board')
}
