'use client'

import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { Card, CardHeader } from '@nextui-org/card'
import { Checkbox } from '@nextui-org/checkbox'
import { cn } from '@nextui-org/theme'
import { LuCalendarDays } from 'react-icons/lu'

import { markTaskAsDoneAction } from '@app/board/actions'
import { formatDateValue, isOverdue } from '@app/board/helpers/date'
import type { PickedTask } from '@app/board/types'

export function TaskCard({ id, name, isDone, dueDate }: Readonly<PickedTask>) {
  const dueDateValue = dueDate
    ? fromDate(dueDate, getLocalTimeZone())
    : undefined

  return (
    <Card>
      <CardHeader
        className={cn(
          isDone && 'opacity-50',
          'flex flex-col items-start gap-1'
        )}
      >
        <div>
          <Checkbox
            color="primary"
            defaultSelected={isDone}
            isDisabled={isDone}
            onClick={() => !isDone && markTaskAsDoneAction(id)}
          />

          {name}
        </div>

        {dueDate && dueDateValue && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              isOverdue(dueDateValue) ? 'text-danger' : 'text-primary'
            )}
          >
            <LuCalendarDays />

            {formatDateValue(dueDateValue)}
          </div>
        )}
      </CardHeader>
    </Card>
  )
}
