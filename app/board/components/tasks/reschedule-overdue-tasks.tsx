'use client'

import type { DateValue } from '@internationalized/date'
import { Button } from '@nextui-org/button'
import { Calendar } from '@nextui-org/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useEffect, useState } from 'react'
import { LuCalendarClock } from 'react-icons/lu'

import { CalendarPresets } from '../misc'

import { now } from '@app/board/helpers/date'
import { useTasksBoard } from '@app/board/context'

export function RescheduleOverdueTasks() {
  const [dueDateValue, setDueDateValue] = useState<DateValue | undefined>()
  const { rescheduleOverdueTasks } = useTasksBoard()

  useEffect(() => {
    if (dueDateValue) {
      void rescheduleOverdueTasks(dueDateValue)
      setDueDateValue(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueDateValue])

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" color="primary">
          <LuCalendarClock />
          Reschedule
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Calendar
          nextButtonProps={{ variant: 'bordered' }}
          prevButtonProps={{ variant: 'bordered' }}
          aria-label="Due date "
          value={dueDateValue}
          minValue={now}
          topContent={
            <CalendarPresets value={dueDateValue} setValue={setDueDateValue} />
          }
        />
      </PopoverContent>
    </Popover>
  )
}
