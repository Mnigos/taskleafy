'use client'

import type { DraggableLocation } from '@hello-pangea/dnd'
import {
  fromDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date'
import type { Task } from '@prisma/client'
import { makeAutoObservable } from 'mobx'

import { dueDateFactory, nextWeek, now, tomorrow } from '../helpers/date'
import type { AddTask } from '../types'
import type { BoardKeyWithoutOverdue, TasksBoard } from '../types/board'

import {
  addTask as addTaskAction,
  getTask,
  rescheduleOverdueTasks as rescheduleOverdueTasksAction,
  updateTask as updateTaskAction,
  type UpdateTaskParams,
} from '@app/board/actions'
import { addAndReorder, initialReorder, reorder } from '@app/utils/reorder'

export class TasksBoardStore {
  tasks: Task[] = []

  constructor(initialTasks: Task[]) {
    makeAutoObservable(this)

    this.tasks = initialTasks
  }

  get tasksBoard(): TasksBoard {
    return {
      overdue: {
        id: 'overdue',
        header: 'Overdue',
        items: initialReorder(
          this.tasks.filter(
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
          this.tasks.filter(
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
          this.tasks.filter(
            task =>
              task.dueDate &&
              !task.isDone &&
              fromDate(task.dueDate, getLocalTimeZone()).compare(tomorrow) >=
                0 &&
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
          this.tasks.filter(
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
          this.tasks.filter(
            task =>
              task.dueDate &&
              !task.isDone &&
              fromDate(task.dueDate, getLocalTimeZone()).compare(nextWeek) >=
                0 &&
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
          this.tasks.filter(
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
          this.tasks.filter(task => !task.dueDate && !task.isDone)
        ),
      },
      done: {
        id: 'done',
        header: 'Done',
        items: initialReorder(this.tasks.filter(task => task.isDone)),
      },
    }
  }

  reorderTasks = async (
    boardKey: BoardKeyWithoutOverdue,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const destinationTasks = this.tasksBoard[boardKey].items

    const task = destinationTasks[sourceIndex]
    const destinationTaskWithSameOrder = destinationTasks.find(
      task => task.order === destinationIndex
    )

    if (!task) return

    this.tasks = [
      ...this.tasks.filter(
        ({ id }) => !destinationTasks.map(task => task.id).includes(id)
      ),
      ...reorder(destinationTasks, destinationIndex, sourceIndex),
    ]

    await updateTaskAction({
      id: task.id,
      data: {
        order: destinationIndex,
      },
    })

    if (destinationTaskWithSameOrder) {
      await updateTaskAction({
        id: destinationTaskWithSameOrder.id,
        data: {
          order: destinationIndex - 1,
        },
      })
    }
  }

  changeTaskTable = async (task: Task, destination: DraggableLocation) => {
    const destinationKey = destination.droppableId as BoardKeyWithoutOverdue

    const destinationTasks = this.tasksBoard[destinationKey].items

    const updatedData =
      destinationKey === 'done'
        ? { isDone: true }
        : {
            dueDate: dueDateFactory(destinationKey),
          }

    const updatedTask = { ...task, ...updatedData }

    const destinationTaskWithSameOrder = destinationTasks.find(
      task => task.order === destination.index
    )

    this.tasks = [
      ...this.tasks.filter(
        ({ id }) =>
          !destinationTasks.map(task => task.id).includes(id) && id !== task.id
      ),
      ...addAndReorder(destinationTasks, destination.index, updatedTask),
    ]

    if (destinationTaskWithSameOrder) {
      await updateTaskAction({
        id: destinationTaskWithSameOrder.id,
        data: {
          order: destination.index - 1,
        },
      })
    }

    await updateTaskAction({
      id: task.id,
      data: {
        ...updatedData,
        order: destination.index,
      },
    })
  }

  addTask = async (data: AddTask) => {
    const newTask = await addTaskAction(data)

    this.tasks = [...this.tasks, newTask]
  }

  updateTask = async ({ id, data }: UpdateTaskParams) => {
    const oldTask = await getTask(id)

    if (!oldTask) return

    const updatedTask = await updateTaskAction({
      id,
      data,
    })

    console.log(updatedTask)

    this.tasks = [...this.tasks.filter(task => task.id !== id), updatedTask]
  }

  markTaskAsDone = async (task: Task) => {
    const updatedTask = { ...task, isDone: true }

    this.tasks = [...this.tasks.filter(({ id }) => id !== task.id), updatedTask]

    await updateTaskAction({
      id: task.id,
      data: updatedTask,
    })
  }

  rescheduleOverdueTasks = async (dueDateValue: DateValue) => {
    const overdueTasks = this.tasksBoard.overdue.items

    this.tasks = [
      ...this.tasks.filter(
        task => !overdueTasks.map(task => task.id).includes(task.id)
      ),
      ...overdueTasks.map(task => ({
        ...task,
        dueDate: dueDateValue.toDate(getLocalTimeZone()),
      })),
    ]

    await rescheduleOverdueTasksAction({
      dueDate: dueDateValue.toDate(getLocalTimeZone()),
    })
  }
}
