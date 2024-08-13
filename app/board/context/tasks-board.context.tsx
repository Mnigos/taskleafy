'use client'

import type { Task } from '@prisma/client'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { fromDate, getLocalTimeZone } from '@internationalized/date'

import type {
  AddTask,
  BoardKeyWithoutOverdue,
  TasksBoard,
} from '@app/board/types'
import {
  boardKeyFactory,
  dueDateFactory,
  now,
  tomorrow,
} from '@app/board/helpers/date'
import {
  useAddTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from '@app/board/hooks'
import { reorder } from '@app/utils/reorder'

export const TasksBoardContext = createContext<{
  tasksBoard: TasksBoard
  reorderTasks: (
    boardKey: BoardKeyWithoutOverdue,
    sourceIndex: number,
    destinationIndex: number
  ) => void
  changeTaskTable: (
    task: Task,
    sourceKey: BoardKeyWithoutOverdue,
    destinationKey: BoardKeyWithoutOverdue
  ) => void
  addTask: (data: AddTask) => void
}>({
  tasksBoard: {
    overdue: {
      id: 'overdue',
      header: 'Overdue',
      items: [],
    },
    today: {
      id: 'today',
      header: 'Today',
      items: [],
    },
    tomorrow: {
      id: 'tomorrow',
      header: 'Tomorrow',
      items: [],
    },
    noDate: {
      id: 'noDate',
      header: 'No date',
      items: [],
    },
    done: {
      id: 'done',
      header: 'Done',
      items: [],
    },
  },
  reorderTasks: () => {},
  changeTaskTable: () => {},
  addTask: () => {},
})

namespace TasksBoardProvider {
  export type Props = Readonly<{ children: ReactNode; initialTasks: Task[] }>
}

export const useTasksBoard = () => useContext(TasksBoardContext)

function TasksBoardProvider({
  children,
  initialTasks,
}: TasksBoardProvider.Props) {
  const { mutate: updateTaskMutation } = useUpdateTaskMutation()
  const { mutateAsync: addTaskMutation, data: addedTask } = useAddTaskMutation()
  const { data: tasks } = useTasksQuery(initialTasks)

  const overdueTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day < now.day
  )
  const todayTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day === now.day
  )
  const tomorrowTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day === tomorrow.day
  )
  const noDateTasks = tasks.filter(task => !task.dueDate && !task.isDone)
  const doneTasks = tasks.filter(task => task.isDone)

  const initialTasksBoard: TasksBoard = {
    overdue: {
      id: 'overdue',
      header: 'Overdue',
      items: overdueTasks,
    },
    today: {
      id: 'today',
      header: 'Today',
      items: todayTasks,
    },
    tomorrow: {
      id: 'tomorrow',
      header: 'Tomorrow',
      items: tomorrowTasks,
    },
    noDate: {
      id: 'noDate',
      header: 'No date',
      items: noDateTasks,
    },
    done: {
      id: 'done',
      header: 'Done',
      items: doneTasks,
    },
  }

  const [tasksBoard, setTasksBoard] = useState(initialTasksBoard)

  function reorderTasks(
    boardKey: BoardKeyWithoutOverdue,
    sourceIndex: number,
    destinationIndex: number
  ) {
    setTasksBoard({
      ...tasksBoard,
      [boardKey]: {
        ...tasks,
        items: reorder(
          tasksBoard[boardKey].items,
          sourceIndex,
          destinationIndex
        ),
      },
    })
  }

  function changeTaskTable(
    task: Task,
    sourceKey: BoardKeyWithoutOverdue,
    destinationKey: BoardKeyWithoutOverdue
  ) {
    const sourceTasks = tasksBoard[sourceKey]
    const destinationTasks = tasksBoard[destinationKey]

    const updatedData =
      destinationKey === 'done'
        ? { isDone: true }
        : {
            dueDate: dueDateFactory(destinationKey),
          }

    updateTaskMutation({
      id: task.id,
      data: updatedData,
    })

    setTasksBoard({
      ...tasksBoard,
      [sourceKey]: {
        ...sourceTasks,
        items: sourceTasks.items.filter(({ id }) => id !== task.id),
      },
      [destinationKey]: {
        ...destinationTasks,
        items: [
          ...destinationTasks.items,
          {
            ...task,
            ...updatedData,
          },
        ],
      },
    })
  }

  async function addTask(data: AddTask) {
    const newTask = await addTaskMutation(data)

    const boardKey = data.dueDate
      ? boardKeyFactory(fromDate(data.dueDate as Date, getLocalTimeZone()))
      : 'noDate'

    console.log(addedTask)

    setTasksBoard({
      ...tasksBoard,
      [boardKey]: {
        ...tasksBoard[boardKey],
        items: [...tasksBoard[boardKey].items, newTask],
      },
    })
  }

  useEffect(() => {
    console.log('added', addedTask)
  }, [addedTask])

  return (
    <TasksBoardContext.Provider
      value={{
        tasksBoard,
        reorderTasks,
        changeTaskTable,
        addTask,
      }}
    >
      {children}
    </TasksBoardContext.Provider>
  )
}

export { TasksBoardProvider }
