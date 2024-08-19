'use client'

import type { DraggableLocation } from '@hello-pangea/dnd'
import {
  fromDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date'
import type { Task } from '@prisma/client'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

import {
  addTask as addTaskAction,
  getTask,
  rescheduleOverdueTasks as rescheduleOverdueTasksAction,
  updateTask as updateTaskAction,
  type UpdateTaskParams,
} from '@app/board/actions'
import {
  boardKeyFactory,
  dueDateFactory,
  now,
  tomorrow,
} from '@app/board/helpers/date'
import { useTasksQuery } from '@app/board/hooks'
import type {
  AddTask,
  BoardKeyWithoutOverdue,
  TasksBoard,
} from '@app/board/types'
import { addAndReorder, initialReorder, reorder } from '@app/utils/reorder'

export const TasksBoardContext = createContext<{
  tasksBoard: TasksBoard
  reorderTasks: (
    boardKey: BoardKeyWithoutOverdue,
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<void>
  changeTaskTable: (
    task: Task,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => Promise<void>
  addTask: (data: AddTask) => Promise<void>
  updateTask: (data: UpdateTaskParams) => Promise<void>
  markTaskAsDone: (
    task: Task,
    sourceKey: Exclude<BoardKeyWithoutOverdue, 'done'>
  ) => Promise<void>
  rescheduleOverdueTasks: (dueDateValue: DateValue) => Promise<void>
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
  reorderTasks: () => Promise.resolve(),
  changeTaskTable: () => Promise.resolve(),
  addTask: () => Promise.resolve(),
  updateTask: () => Promise.resolve(),
  markTaskAsDone: () => Promise.resolve(),
  rescheduleOverdueTasks: () => Promise.resolve(),
})

namespace TasksBoardProvider {
  export type Props = Readonly<{ children: ReactNode; initialTasks: Task[] }>
}

export const useTasksBoard = () => useContext(TasksBoardContext)

function TasksBoardProvider({
  children,
  initialTasks,
}: TasksBoardProvider.Props) {
  const { data: tasks } = useTasksQuery(initialTasks)

  const [tasksBoard, setTasksBoard] = useState<TasksBoard>({
    overdue: {
      id: 'overdue',
      header: 'Overdue',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).day < now.day
        )
      ),
    },
    today: {
      id: 'today',
      header: 'Today',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).day === now.day
        )
      ),
    },
    tomorrow: {
      id: 'tomorrow',
      header: 'Tomorrow',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).day === tomorrow.day
        )
      ),
    },
    noDate: {
      id: 'noDate',
      header: 'No date',
      items: initialReorder(
        tasks.filter(task => !task.dueDate && !task.isDone)
      ),
    },
    done: {
      id: 'done',
      header: 'Done',
      items: initialReorder(tasks.filter(task => task.isDone)),
    },
  })

  async function reorderTasks(
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
          destinationIndex,
          sourceIndex
        ),
      },
    })

    const task = tasksBoard[boardKey].items[sourceIndex]

    if (task)
      await updateTaskAction({
        id: task.id,
        data: {
          order: destinationIndex,
        },
      })
  }

  async function changeTaskTable(
    task: Task,
    source: DraggableLocation,
    destination: DraggableLocation
  ) {
    const sourceKey = source.droppableId as BoardKeyWithoutOverdue
    const destinationKey = destination.droppableId as BoardKeyWithoutOverdue

    const sourceTasks = tasksBoard[sourceKey]
    const destinationTasks = tasksBoard[destinationKey]

    const updatedData =
      destinationKey === 'done'
        ? { isDone: true }
        : {
            dueDate: dueDateFactory(destinationKey),
          }

    const updatedTask = { ...task, ...updatedData }

    setTasksBoard({
      ...tasksBoard,
      [sourceKey]: {
        ...sourceTasks,
        items: sourceTasks.items.filter(({ id }) => id !== task.id),
      },
      [destinationKey]: {
        ...destinationTasks,
        items: addAndReorder(
          destinationTasks.items,
          destination.index,
          updatedTask
        ),
      },
    })

    await updateTaskAction({
      id: task.id,
      data: {
        ...updatedData,
        order: destination.index,
      },
    })
  }

  async function addTask(data: AddTask) {
    const newTask = await addTaskAction(data)

    const boardKey = data.dueDate
      ? boardKeyFactory(fromDate(data.dueDate as Date, getLocalTimeZone()))
      : 'noDate'

    setTasksBoard({
      ...tasksBoard,
      [boardKey]: {
        ...tasksBoard[boardKey],
        items: [...tasksBoard[boardKey].items, newTask],
      },
    })
  }

  async function updateTask({ id, data }: UpdateTaskParams) {
    const oldTask = await getTask(id)

    if (!oldTask) return

    const { dueDate: oldDueDate } = oldTask

    const updatedTask = await updateTaskAction({
      id,
      data,
    })

    const oldBoardKey = oldDueDate
      ? boardKeyFactory(fromDate(oldDueDate, getLocalTimeZone()))
      : 'noDate'
    const boardKey = data.dueDate
      ? boardKeyFactory(fromDate(data.dueDate, getLocalTimeZone()))
      : 'noDate'

    if (oldBoardKey === boardKey)
      setTasksBoard({
        ...tasksBoard,
        [boardKey]: {
          ...tasksBoard[boardKey],
          items: [
            ...tasksBoard[boardKey].items.filter(task => task.id !== id),
            updatedTask,
          ],
        },
      })
    else
      setTasksBoard({
        ...tasksBoard,
        [oldBoardKey]: {
          ...tasksBoard[oldBoardKey],
          items: tasksBoard[oldBoardKey].items.filter(({ id }) => id !== id),
        },
        [boardKey]: {
          ...tasksBoard[boardKey],
          items: [...tasksBoard[boardKey].items, updatedTask],
        },
      })
  }

  async function markTaskAsDone(task: Task, sourceKey: BoardKeyWithoutOverdue) {
    const updatedTask = { ...task, isDone: true }

    setTasksBoard({
      ...tasksBoard,
      [sourceKey]: {
        ...tasksBoard[sourceKey],
        items: tasksBoard[sourceKey].items.filter(({ id }) => id !== task.id),
      },
      done: {
        ...tasksBoard.done,
        items: [...tasksBoard.done.items, updatedTask],
      },
    })

    await updateTaskAction({
      id: task.id,
      data: updatedTask,
    })
  }

  async function rescheduleOverdueTasks(dueDateValue: DateValue) {
    const overdueTasks = tasksBoard.overdue.items

    const boardKey = boardKeyFactory(dueDateValue)

    setTasksBoard({
      ...tasksBoard,
      overdue: {
        ...tasksBoard.overdue,
        items: [],
      },
      [boardKey]: {
        ...tasksBoard[boardKey],
        items: [
          ...tasksBoard[boardKey].items,
          ...overdueTasks.map(task => ({
            ...task,
            dueDate: dueDateValue.toDate(getLocalTimeZone()),
          })),
        ],
      },
    })

    await rescheduleOverdueTasksAction({
      dueDate: dueDateValue.toDate(getLocalTimeZone()),
    })
  }

  return (
    <TasksBoardContext.Provider
      value={{
        tasksBoard,
        reorderTasks,
        changeTaskTable,
        addTask,
        updateTask,
        markTaskAsDone,
        rescheduleOverdueTasks,
      }}
    >
      {children}
    </TasksBoardContext.Provider>
  )
}

export { TasksBoardProvider }
