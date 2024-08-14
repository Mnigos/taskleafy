'use client'

import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardHeader } from '@nextui-org/card'
import { Checkbox } from '@nextui-org/checkbox'
import { cn } from '@nextui-org/theme'
import { LuCalendarDays } from 'react-icons/lu'

import { formatDateValue, isOverdue } from '@app/board/helpers/date'
import type { BoardKeyWithoutOverdue, PickedTask } from '@app/board/types'
import { useTasksBoard } from '@app/board/context'

namespace TaskCard {
  export type Props = Readonly<
    PickedTask & {
      index: number
    }
  >
}

function TaskCard({ id, name, isDone, dueDate, index }: TaskCard.Props) {
  const { tasksBoard, markTaskAsDone } = useTasksBoard()

  const dueDateValue = dueDate
    ? fromDate(dueDate, getLocalTimeZone())
    : undefined

  return (
    <Draggable draggableId={id} index={index}>
      {(
        { innerRef, draggableProps, dragHandleProps },
        { isDragging },
        { source: { droppableId } }
      ) => (
        <Card
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={cn(isDragging && 'opacity-50')}
        >
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
                onClick={() => {
                  const sourceKey = droppableId as BoardKeyWithoutOverdue
                  const task = tasksBoard[sourceKey].items.find(
                    task => task.id === id
                  )

                  if (!isDone && task && sourceKey !== 'done')
                    setTimeout(() => {
                      markTaskAsDone(task, sourceKey)
                    }, 500)
                }}
              />

              {name}
            </div>

            {dueDate && dueDateValue && !isDone && (
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
      )}
    </Draggable>
  )
}

export { TaskCard }
