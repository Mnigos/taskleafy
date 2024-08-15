'use client'

import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardHeader } from '@nextui-org/card'
import { Checkbox } from '@nextui-org/checkbox'
import { cn } from '@nextui-org/theme'
import { LuCalendarDays } from 'react-icons/lu'
import { useState } from 'react'

import { UpdateTaskModal } from './update-task-modal'

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

function TaskCard({
  id,
  name,
  description,
  isDone,
  dueDate,
  index,
}: TaskCard.Props) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const { tasksBoard, markTaskAsDone } = useTasksBoard()

  const dueDateValue = dueDate
    ? fromDate(dueDate, getLocalTimeZone())
    : undefined

  return (
    <>
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
            onClick={() => {
              console.log('clicked')
            }}
          >
            <CardHeader
              className={cn(isDone && 'opacity-50')}
              onClick={() => {
                setIsUpdateModalOpen(true)
              }}
            >
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
                    setTimeout(async () => {
                      await markTaskAsDone(task, sourceKey)
                    }, 500)
                }}
              />

              <div className="flex flex-col items-start gap-1">
                <div>{name}</div>

                {description && (
                  <p className="text-xs text-white/75">{description}</p>
                )}

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
              </div>
            </CardHeader>
          </Card>
        )}
      </Draggable>

      <UpdateTaskModal
        id={id}
        name={name}
        description={description}
        dueDate={dueDate}
        isOpen={isUpdateModalOpen}
        closeModal={() => {
          setIsUpdateModalOpen(false)
        }}
      />
    </>
  )
}

export { TaskCard }
