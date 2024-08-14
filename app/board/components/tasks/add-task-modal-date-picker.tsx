'use client'

import { type DateValue } from '@internationalized/date'
import { Button, ButtonGroup } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { useState } from 'react'
import { LuXCircle } from 'react-icons/lu'

import { now, tomorrow, nextWeek } from '@app/board/helpers/date'

export function AddTaskModalDatePicker() {
  const [dueDateValue, setDueDateValue] = useState<DateValue | undefined>(
    undefined
  )

  return (
    <DatePicker
      label="Due date"
      name="dueDate"
      variant="bordered"
      value={dueDateValue}
      minValue={now}
      calendarProps={{
        focusedValue: dueDateValue,
        onFocusChange: setDueDateValue,
        nextButtonProps: {
          variant: 'bordered',
        },
        prevButtonProps: {
          variant: 'bordered',
        },
      }}
      startContent={
        <Button
          variant="light"
          size="sm"
          radius="full"
          isIconOnly
          aria-label="Clear"
          className="h-6 w-6 min-w-6 text-inherit"
          onPress={() => {
            setDueDateValue(undefined)
          }}
        >
          <LuXCircle />
        </Button>
      }
      CalendarTopContent={
        <ButtonGroup
          fullWidth
          size="sm"
          radius="full"
          variant="bordered"
          className="bg-content1 px-2 pt-2"
        >
          <Button
            onPress={() => {
              setDueDateValue(now)
            }}
            variant={
              dueDateValue?.toString() === now.toString() ? 'solid' : 'bordered'
            }
          >
            Today
          </Button>
          <Button
            onPress={() => {
              setDueDateValue(tomorrow)
            }}
            variant={
              dueDateValue?.toString() === tomorrow.toString()
                ? 'solid'
                : 'bordered'
            }
          >
            Tomorrow
          </Button>
          <Button
            onPress={() => {
              setDueDateValue(nextWeek)
            }}
            variant={
              dueDateValue?.toString() === nextWeek.toString()
                ? 'solid'
                : 'bordered'
            }
          >
            Next week
          </Button>
        </ButtonGroup>
      }
    />
  )
}
