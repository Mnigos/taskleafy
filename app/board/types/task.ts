import type { Prisma, Task } from '@prisma/client'
import type { SetOptional } from 'type-fest'

import type { prisma } from '@app/db'

export type PickedTask = SetOptional<
  Pick<Task, 'id' | 'name' | 'isDone' | 'dueDate'>,
  'dueDate'
>

export type AddTask = Omit<
  Prisma.Args<typeof prisma.task, 'create'>['data'],
  'user' | 'userId'
>
