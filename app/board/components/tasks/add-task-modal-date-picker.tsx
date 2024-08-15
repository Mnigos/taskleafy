'use client'

import { type DateValue } from '@internationalized/date'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
import { useState } from 'react'
import { LuXCircle } from 'react-icons/lu'

import { CalendarPresets } from '../misc'

import { now } from '@app/board/helpers/date'

namespace AddTaskModalDatePicker {
  export type Props = Readonly<{
    defaultValue?: DateValue
  }>
}

function AddTaskModalDatePicker({
  defaultValue,
}: AddTaskModalDatePicker.Props) {
  const [dueDateValue, setDueDateValue] = useState<DateValue | undefined>(
    defaultValue
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
        <CalendarPresets value={dueDateValue} setValue={setDueDateValue} />
      }
    />
  )
}

export { AddTaskModalDatePicker }
