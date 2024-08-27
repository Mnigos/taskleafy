'use client'

import { createContext, type ReactNode } from 'react'
import type { Task } from '@prisma/client'

import { TasksBoardStore } from '../stores'

export const TasksBoardContext = createContext<TasksBoardStore>(null!)

export function TasksBoardProvider({
  children,
  initialTasks,
}: Readonly<{ children: ReactNode; initialTasks: Task[] }>) {
  const store = new TasksBoardStore(initialTasks)

  return (
    <TasksBoardContext.Provider value={store}>
      {children}
    </TasksBoardContext.Provider>
  )
}
