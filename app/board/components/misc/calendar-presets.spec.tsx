import { render, screen } from '@testing-library/react'
import { userEvent, type UserEvent } from '@testing-library/user-event'

import { CalendarPresets } from './calendar-presets'

import { nextWeek, now, tomorrow } from '@app/board/helpers/date'

describe('CalendarPresets', () => {
  const setValueSpy = vi.fn()

  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
  })

  test('should set today value', async () => {
    render(<CalendarPresets value={tomorrow} setValue={setValueSpy} />)

    await user.click(screen.getByText('Today'))

    expect(setValueSpy).toHaveBeenCalledWith(now)
  })

  test('should set tomorrow value', async () => {
    render(<CalendarPresets value={now} setValue={setValueSpy} />)

    await user.click(screen.getByText('Tomorrow'))

    expect(setValueSpy).toHaveBeenCalledWith(tomorrow)
  })

  test('should set next week value', async () => {
    render(<CalendarPresets value={now} setValue={setValueSpy} />)

    await user.click(screen.getByText('Next week'))

    expect(setValueSpy).toHaveBeenCalledWith(nextWeek)
  })
})
