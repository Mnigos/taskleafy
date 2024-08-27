import { render, screen } from '@testing-library/react'
import { mock } from 'vitest-mock-extended'
import type { Task } from '@prisma/client'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import type { ReactNode } from 'react'

import { TasksList } from './tasks-list'

vi.mock('@app/board/hooks', () => ({
  useTasksBoard: () => ({
    tasksBoard: vi.fn(),
    markTaskAsDone: vi.fn(),
  }),
}))

const Wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
  <DragDropContext onDragEnd={vi.fn()}>
    <Droppable droppableId="today">
      {({ droppableProps, innerRef, placeholder }) => (
        <div ref={innerRef} {...droppableProps}>
          {children}
          {placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
)

describe('TasksList', () => {
  test('should render one task', () => {
    const header = 'Today'
    const taskName = 'Task 1'

    const tasks = [
      mock<Task>({
        name: taskName,
        dueDate: null,
        id: '1',
      }),
    ]

    render(<TasksList header={header} tasks={tasks} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByText(header)).toBeInTheDocument()
    expect(screen.getByText(taskName)).toBeInTheDocument()
    expect(screen.getByText('1 task')).toBeInTheDocument()
  })

  test('should render multiple tasks', () => {
    const header = 'Today'
    const taskName = 'Task 1'
    const taskName2 = 'Task 2'

    const tasks = [
      mock<Task>({
        name: taskName,
        dueDate: null,
        id: '1',
      }),
      mock<Task>({
        name: taskName2,
        dueDate: null,
        id: '2',
      }),
    ]

    render(<TasksList header={header} tasks={tasks} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByText(header)).toBeInTheDocument()
    expect(screen.getByText(taskName)).toBeInTheDocument()
    expect(screen.getByText(taskName2)).toBeInTheDocument()
    expect(screen.getByText('2 tasks')).toBeInTheDocument()
  })

  test('should render with RescheduleOverdueTasks', () => {
    const header = 'Overdue'
    const taskName = 'Task 1'
    const taskName2 = 'Task 2'

    const tasks = [
      mock<Task>({
        name: taskName,
        dueDate: null,
        id: '1',
      }),
      mock<Task>({
        name: taskName2,
        dueDate: null,
        id: '2',
      }),
    ]

    render(
      <TasksList header={header} tasks={tasks} />,

      {
        wrapper: Wrapper,
      }
    )

    expect(screen.getByText(header)).toBeInTheDocument()
    expect(screen.getByText(taskName)).toBeInTheDocument()
    expect(screen.getByText(taskName2)).toBeInTheDocument()
    expect(screen.getByText('2 tasks')).toBeInTheDocument()
    expect(screen.getByText('Reschedule')).toBeInTheDocument()
  })
})
