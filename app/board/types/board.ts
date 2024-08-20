import type { Task } from '@prisma/client'

export type BoardKey =
  | 'today'
  | 'tomorrow'
  | 'noDate'
  | 'done'
  | 'overdue'
  | 'nextWeek'
  | 'future'
export type BoardKeyWithoutOverdue = Exclude<BoardKey, 'overdue'>

export type TasksBoard = Record<
  BoardKey,
  {
    id: BoardKey
    header: string
    items: Task[]
  }
>
