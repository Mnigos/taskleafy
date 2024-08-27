import { getLocalTimeZone } from '@internationalized/date'
import type { Task } from '@prisma/client'
import { mock } from 'vitest-mock-extended'

import { addTask, getTask, updateTask } from '../actions'
import { now, tomorrow } from '../helpers/date'

import { TasksBoardStore } from './tasks-board.store'

vi.mock('@app/board/actions')

describe('TasksBoardStore', () => {
  test('should initialize with initial tasks', () => {
    const tasks = [mock<Task>()]

    const store = new TasksBoardStore(tasks)

    expect(store.tasks).toEqual(tasks)
  })

  test('should create tasks board', () => {
    const tasks = [
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        isDone: false,
      }),
    ]

    const store = new TasksBoardStore(tasks)

    expect(store.tasks).toEqual(tasks)
    expect(store.tasksBoard.today.items).toEqual(tasks)
  })

  test('should reorder tasks', async () => {
    const tasks = [
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        isDone: false,
      }),
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        isDone: false,
      }),
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        isDone: false,
      }),
    ]

    const store = new TasksBoardStore(tasks)

    await store.reorderTasks('today', 0, 1)

    expect(store.tasksBoard.today.items).toEqual([tasks[1], tasks[0], tasks[2]])
  })

  test('should change task table', async () => {
    const tasks = [
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        isDone: false,
      }),
      mock<Task>({
        dueDate: now.toDate(getLocalTimeZone()),
        id: '1',
        isDone: false,
      }),
      mock<Task>({
        dueDate: tomorrow.toDate(getLocalTimeZone()),
        isDone: false,
      }),
    ]

    const store = new TasksBoardStore(tasks)

    await store.changeTaskTable(tasks[1]!, {
      droppableId: 'tomorrow',
      index: 0,
    })

    expect(store.tasksBoard.today.items).toEqual([tasks[0]])
    expect(store.tasksBoard.tomorrow.items).toEqual([
      {
        ...tasks[1],
        dueDate: tomorrow.toDate(getLocalTimeZone()),
      },
      tasks[2],
    ])
  })

  test('should add task', async () => {
    const tasks = [
      mock<Task>({
        isDone: false,
        name: 'Task 0',
      }),
    ]

    const newTaskFactory = (name: string) =>
      mock<Task>({
        name,
        isDone: false,
      })

    vi.mocked(addTask).mockImplementation(({ name }) =>
      Promise.resolve(newTaskFactory(name))
    )

    const store = new TasksBoardStore(tasks)

    await store.addTask({
      name: 'Task 1',
    })

    expect(store.tasks.find(task => task.name === 'Task 1')).toBeDefined()
  })

  test('should update task', async () => {
    const tasks = [
      mock<Task>({
        isDone: false,
        name: 'Task 0',
      }),
    ]

    vi.mocked(getTask).mockResolvedValue(tasks[0]!)
    vi.mocked(updateTask).mockImplementation(({ id, data }) =>
      Promise.resolve(
        mock<Task>({
          ...data,
          id,
          isDone: false,
        })
      )
    )

    const store = new TasksBoardStore(tasks)

    await store.updateTask({
      id: tasks[0]!.id,
      data: {
        name: 'Task 1',
      },
    })

    expect(store.tasks.find(task => task.name === 'Task 1')).toBeDefined()
  })

  test('should mark task as done', async () => {
    const tasks = [
      mock<Task>({
        isDone: false,
        name: 'Task 0',
      }),
    ]

    vi.mocked(getTask).mockResolvedValue(tasks[0]!)
    vi.mocked(updateTask).mockImplementation(({ id, data }) =>
      Promise.resolve(
        mock<Task>({
          ...data,
          id,
          isDone: true,
        })
      )
    )

    const store = new TasksBoardStore(tasks)

    await store.markTaskAsDone(tasks[0]!)

    expect(store.tasks.find(task => task.isDone)).toBeDefined()
  })

  test('should reschedule overdue tasks', async () => {
    const tasks = [
      mock<Task>({
        dueDate: now.add({ days: 1 }).toDate(getLocalTimeZone()),
        isDone: false,
      }),
    ]

    const store = new TasksBoardStore(tasks)

    await store.rescheduleOverdueTasks(tomorrow)

    expect(store.tasks[0]?.dueDate?.toISOString()).toEqual(
      tomorrow.toDate(getLocalTimeZone()).toISOString()
    )
  })
})
