'use server'

import type { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { prisma } from '@app/db'
import { auth } from '@app/auth'

type AddTask = Omit<
  Prisma.Args<typeof prisma.task, 'create'>['data'],
  'user' | 'userId'
>

export async function addTaskAction(data: AddTask) {
  const session = await auth()

  if (!session?.user?.id) throw new Error('Not authenticated')

  await prisma.task.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  revalidatePath('/board')
}
