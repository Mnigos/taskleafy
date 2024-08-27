import { render, screen } from '@testing-library/react'
import { userEvent, type UserEvent } from '@testing-library/user-event'

import { RescheduleOverdueTasks } from './reschedule-overdue-tasks'

import { useTasksBoard } from '@app/board/hooks'

vi.mock('@app/board/hooks')

describe('RescheduleOverdueTasks', () => {
  const rescheduleOverdueTasksSpy = vi.fn().mockResolvedValue(undefined)
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()

    vi.mocked(useTasksBoard).mockReturnValue({
      rescheduleOverdueTasks: rescheduleOverdueTasksSpy,
    } as unknown as ReturnType<typeof useTasksBoard>)
  })

  test('should render', () => {
    render(<RescheduleOverdueTasks />)

    expect(screen.getByText('Reschedule')).toBeInTheDocument()
  })

  test('should show calendar on click', async () => {
    render(<RescheduleOverdueTasks />)

    expect(screen.queryByText('Today')).not.toBeInTheDocument()

    await user.click(screen.getByText('Reschedule'))

    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  test('should call rescheduleOverdueTasks on click', async () => {
    render(<RescheduleOverdueTasks />)

    await user.click(screen.getByText('Reschedule'))
    await user.click(screen.getByText('Today'))

    expect(rescheduleOverdueTasksSpy).toHaveBeenCalled()
  })
})
