import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import userEvent from '@testing-library/user-event'

import { ShowDoneTasksCheckbox } from './show-done-tasks-checkbox'

vi.mock('next/navigation')

describe('ShowDoneTasksCheckbox', () => {
  test('should match snapshot as unselected', () => {
    const view = render(<ShowDoneTasksCheckbox showDone={false} />)

    expect(view).toMatchSnapshot()
  })

  test('should match snapshot as selected', () => {
    const view = render(<ShowDoneTasksCheckbox showDone={true} />)

    expect(view).toMatchSnapshot()
  })

  test('should call route.push on value change', async () => {
    const pushSpy = vi.fn()
    const user = userEvent.setup()

    vi.mocked(useRouter).mockReturnValue({
      push: pushSpy,
    } as unknown as ReturnType<typeof useRouter>)

    render(<ShowDoneTasksCheckbox showDone={false} />)

    await user.click(screen.getByText('Show done tasks'))

    expect(pushSpy).toHaveBeenCalledWith('/board?show-done=true')
  })
})
