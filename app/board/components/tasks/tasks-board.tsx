'use client'

import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'

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

  function onDragEng({ source, destination, draggableId }: DropResult) {
    if (!destination) return

    if (destination.droppableId === source.droppableId) {
      reorderTasks(
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
        changeTaskTable(itemToDrop, source, destination)
      }
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEng}>
        {tasksBoardEntries.map(([id, { header, items }]) => (
          <Droppable key={id} droppableId={id}>
            {({ droppableProps, innerRef, placeholder }) => (
              <div ref={innerRef} {...droppableProps}>
                <TasksList tasks={items} header={header} />
                {placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </>
  )
}

export { TasksBoard }
