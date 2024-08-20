import { getLocalTimeZone } from '@internationalized/date'
import type { Task } from '@prisma/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { userEvent, type UserEvent } from '@testing-library/user-event'
import { Fragment } from 'react'
import { mock } from 'vitest-mock-extended'

import {
  addTask,
  getTask,
  rescheduleOverdueTasks,
  updateTask,
} from '../actions'
import { now, tomorrow, yesterday } from '../helpers/date'
import type { BoardKeyWithoutOverdue } from '../types'

import { TasksBoardProvider, useTasksBoard } from './tasks-board.context'

vi.mock('@app/board/actions')

function TestingWrapper({ initialTasks }: Readonly<{ initialTasks: Task[] }>) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <TasksBoardProvider initialTasks={initialTasks}>
        <TestingComponent />
      </TasksBoardProvider>
    </QueryClientProvider>
  )
}

function TestingComponent() {
  const {
    tasksBoard,
    addTask,
    updateTask,
    markTaskAsDone,
    rescheduleOverdueTasks,
    reorderTasks,
    changeTaskTable,
  } = useTasksBoard()

  const tasksBoardEntries = Object.entries(tasksBoard)

  return (
    <div>
      {tasksBoardEntries.map(([id, { header, items }]) => (
        <Fragment key={id}>
          {items.length > 0 && (
            <div key={id}>
              <h2>{header}</h2>

              {items.map(task => (
                <div key={task.id}>
                  <p>{task.name}</p>
                  <p>{task.description}</p>
                  <p>{task.dueDate?.toString()}</p>
                  {task.isDone && (
                    <p data-testid="is-done">{task.isDone.toString()}</p>
                  )}

                  <button
                    onClick={() =>
                      updateTask({
                        id: task.id,
                        data: {
                          name: 'Task 2',
                        },
                      })
                    }
                  >
                    Update
                  </button>

                  <button
                    onClick={() =>
                      updateTask({
                        id: task.id,
                        data: {
                          dueDate: tomorrow.toDate(getLocalTimeZone()),
                        },
                      })
                    }
                  >
                    Reschedule
                  </button>

                  <button onClick={() => rescheduleOverdueTasks(now)}>
                    Reschedule overdue
                  </button>

                  <button
                    onClick={() =>
                      markTaskAsDone(
                        task,
                        id as Exclude<BoardKeyWithoutOverdue, 'done'>
                      )
                    }
                  >
                    Mark as done
                  </button>

                  <button
                    onClick={() =>
                      reorderTasks(
                        id as Exclude<BoardKeyWithoutOverdue, 'done'>,
                        0,
                        1
                      )
                    }
                  >
                    Reorder
                  </button>

                  <button
                    onClick={() =>
                      changeTaskTable(
                        task,
                        {
                          droppableId: 'today',
                          index: 0,
                        },
                        {
                          droppableId: 'tomorrow',
                          index: 0,
                        }
                      )
                    }
                  >
                    Change table
                  </button>
                </div>
              ))}
            </div>
          )}
        </Fragment>
      ))}

      <button onClick={() => addTask({ name: 'Task 10' })}>Add task</button>
    </div>
  )
}

describe('TasksBoardProvider', () => {
  const taskName = 'Task 1'

  const initialTasks = mock<Task[]>([
    {
      id: '1',
      name: taskName,
      dueDate: now.toDate(getLocalTimeZone()),
      isDone: false,
    },
  ])

  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
  })

  test('should render tasks board', () => {
    render(<TestingWrapper initialTasks={initialTasks} />)

    expect(screen.getByText(taskName)).toBeInTheDocument()
  })

  describe('addTask', () => {
    test('should add task', async () => {
      const addTaskActionSpy = vi
        .mocked(addTask)
        .mockImplementation((data: Parameters<typeof addTask>[0]) =>
          Promise.resolve({
            ...data,
            id: '10',
            isDone: false,
          } as Task)
        )

      render(<TestingWrapper initialTasks={initialTasks} />)

      await user.click(screen.getByRole('button', { name: 'Add task' }))

      expect(screen.getByText('Task 10')).toBeInTheDocument()
      expect(addTaskActionSpy).toHaveBeenCalledWith({
        name: 'Task 10',
      })
    })
  })

  describe('updateTask', () => {
    test('should update task within the same section', async () => {
      const updateTaskActionSpy = vi
        .mocked(updateTask)
        .mockImplementation(({ id, data }: Parameters<typeof updateTask>[0]) =>
          Promise.resolve({
            ...data,
            id,
            isDone: false,
          } as Task)
        )
      const getTaskActionSpy = vi
        .mocked(getTask)
        .mockResolvedValue(initialTasks[0]!)

      render(<TestingWrapper initialTasks={initialTasks} />)

      expect(screen.getByText('Task 1')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Update' }))

      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(getTaskActionSpy).toHaveBeenCalledWith('1')
      expect(updateTaskActionSpy).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Task 2',
        },
      })
    })

    test('should update task within another section', async () => {
      const updateTaskActionSpy = vi
        .mocked(updateTask)
        .mockImplementation(({ id, data }: Parameters<typeof updateTask>[0]) =>
          Promise.resolve({
            ...data,
            id,
            isDone: false,
          } as Task)
        )
      const getTaskActionSpy = vi
        .mocked(getTask)
        .mockResolvedValue(initialTasks[1]!)

      render(<TestingWrapper initialTasks={initialTasks} />)

      expect(screen.getByText('Today')).toBeInTheDocument()

      await user.click(
        screen.getAllByRole('button', { name: 'Reschedule' })[0]!
      )

      expect(getTaskActionSpy).toHaveBeenCalledWith('1')
      expect(screen.getByText('Tomorrow')).toBeInTheDocument()
      expect(updateTaskActionSpy).toHaveBeenCalledWith({
        id: '1',
        data: {
          dueDate: tomorrow.toDate(getLocalTimeZone()),
        },
      })
    })
  })

  describe('markTaskAsDone', () => {
    test('should mark task as done', async () => {
      const updateTaskActionSpy = vi
        .mocked(updateTask)
        .mockImplementation((data: Parameters<typeof updateTask>[0]) =>
          Promise.resolve({
            ...data,
            id: '10',
            isDone: true,
          } as unknown as Task)
        )
      const getTaskActionSpy = vi
        .mocked(getTask)
        .mockResolvedValue(initialTasks[0]!)

      render(<TestingWrapper initialTasks={initialTasks} />)

      expect(screen.getByText('Task 1')).toBeInTheDocument()

      await user.click(
        screen.getAllByRole('button', { name: 'Mark as done' })[0]!
      )

      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(getTaskActionSpy).toHaveBeenCalledWith('1')
      expect(updateTaskActionSpy).toHaveBeenCalled()
      expect(screen.getByTestId('is-done')).toHaveTextContent('true')
    })
  })

  describe('rescheduleOverdueTasks', () => {
    test('should reschedule overdue tasks', async () => {
      const initialTasks = mock<Task[]>([
        {
          id: '1',
          name: taskName,
          dueDate: yesterday.toDate(getLocalTimeZone()),
          isDone: false,
        },
      ])

      const rescheduleOverdueTasksActionSpy = vi.mocked(rescheduleOverdueTasks)

      render(<TestingWrapper initialTasks={initialTasks} />)

      expect(screen.getByText('Overdue')).toBeInTheDocument()

      await user.click(
        screen.getAllByRole('button', { name: 'Reschedule overdue' })[0]!
      )

      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(rescheduleOverdueTasksActionSpy).toHaveBeenCalled()
    })
  })

  describe('reorderTasks', () => {
    test('should reorder tasks', async () => {
      const updateTaskActionSpy = vi
        .mocked(updateTask)
        .mockImplementation((data: Parameters<typeof updateTask>[0]) =>
          Promise.resolve({
            ...data,
            id: '10',
            isDone: true,
          } as unknown as Task)
        )

      render(<TestingWrapper initialTasks={initialTasks} />)

      await user.click(screen.getAllByRole('button', { name: 'Reorder' })[0]!)

      expect(updateTaskActionSpy).toHaveBeenCalled()
    })
  })

  describe('changeTaskTable', () => {
    test('should change task table', async () => {
      const updateTaskActionSpy = vi
        .mocked(updateTask)
        .mockImplementation((data: Parameters<typeof updateTask>[0]) =>
          Promise.resolve({
            ...data,
            id: '10',
            isDone: true,
          } as unknown as Task)
        )

      render(<TestingWrapper initialTasks={initialTasks} />)

      await user.click(
        screen.getAllByRole('button', { name: 'Change table' })[0]!
      )

      expect(updateTaskActionSpy).toHaveBeenCalled()
    })
  })
})
