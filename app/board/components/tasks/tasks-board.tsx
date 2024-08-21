'use client'

import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Fragment } from 'react'

import { TasksList } from './tasks-list'

import { useTasksBoard } from '@app/board/context'
import type { BoardKey, BoardKeyWithoutOverdue } from '@app/board/types'

namespace TasksBoard {
  export type Props = Readonly<{
    showDone: boolean
  }>
}

function TasksBoard({ showDone }: TasksBoard.Props) {
  const { tasksBoard, reorderTasks, changeTaskTable } = useTasksBoard()

  const tasksBoardEntries = Object.entries(tasksBoard).filter(([key]) =>
    showDone ? true : key !== 'done'
  )

  const tasks = Object.values(tasksBoard).flatMap(board => board.items)

  async function onDragEng({ source, destination, draggableId }: DropResult) {
    if (!destination) return

    if (destination.droppableId === source.droppableId) {
      await reorderTasks(
        source.droppableId as BoardKeyWithoutOverdue,
        source.index,
        destination.index
      )
    }

    if (destination.droppableId !== source.droppableId) {
      const sourceTasks = tasksBoard[source.droppableId as BoardKey]

      const itemToDrop = sourceTasks.items.find(({ id }) => id === draggableId)

      if (destination.droppableId === 'overdue') return

      if (itemToDrop) {
        await changeTaskTable(itemToDrop, source, destination)
      }
    }
  }

  return (
    <>
      {tasks.length === 0 && (
        <div className="flex items-center justify-center md:min-h-[80vh]">
          Nothing here yet. Add you first task and plan your day schedule.
        </div>
      )}

      <DragDropContext onDragEnd={onDragEng}>
        {tasksBoardEntries.map(([id, { header, items }]) => (
          <Fragment key={id}>
            {items.length > 0 && (
              <Droppable droppableId={id}>
                {({ droppableProps, innerRef, placeholder }) => (
                  <div ref={innerRef} {...droppableProps}>
                    <TasksList tasks={items} header={header} />
                    {placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </Fragment>
        ))}
      </DragDropContext>
    </>
  )
}

export { TasksBoard }
