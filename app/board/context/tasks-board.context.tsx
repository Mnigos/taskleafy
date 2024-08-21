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
  nextWeek,
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
  tasks: Task[]
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
  tasks: [],
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
    thisWeek: {
      id: 'thisWeek',
      header: 'This week',
      items: [],
    },
    nextWeek: {
      id: 'nextWeek',
      header: 'Next week',
      items: [],
    },
    future: {
      id: 'future',
      header: 'Future',
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
            fromDate(task.dueDate, getLocalTimeZone()).compare(now) < 0
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
            fromDate(task.dueDate, getLocalTimeZone()).compare(now) >= 0 &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(tomorrow) < 0
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
            fromDate(task.dueDate, getLocalTimeZone()).compare(tomorrow) >= 0 &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(
              tomorrow.add({ days: 1 })
            ) < 0
        )
      ),
    },
    thisWeek: {
      id: 'thisWeek',
      header: 'This week',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(
              tomorrow.add({ days: 1 })
            ) >= 0 &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(nextWeek) < 0
        )
      ),
    },
    nextWeek: {
      id: 'nextWeek',
      header: 'Next week',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(nextWeek) >= 0 &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(
              nextWeek.add({ days: 7 })
            ) < 0
        )
      ),
    },
    future: {
      id: 'future',
      header: 'Future',
      items: initialReorder(
        tasks.filter(
          task =>
            task.dueDate &&
            !task.isDone &&
            fromDate(task.dueDate, getLocalTimeZone()).compare(
              nextWeek.add({ days: 7 })
            ) > 0
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

    const boardKey = boardKeyFactory(data.dueDate)

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

    const oldBoardKey = boardKeyFactory(oldDueDate)
    const boardKey = boardKeyFactory(data.dueDate)

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
          items: tasksBoard[oldBoardKey].items.filter(task => task.id !== id),
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
        tasks,
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
