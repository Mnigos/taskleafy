import type { Task } from '@prisma/client'
import type { SetOptional } from 'type-fest'

export type PickedTask = SetOptional<
  Pick<Task, 'id' | 'name' | 'isDone' | 'dueDate'>,
  'dueDate'
>
