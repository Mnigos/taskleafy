import type { Task } from '@prisma/client'
import type { SetOptional } from 'type-fest'

import { TaskModal, type TaskSchema } from './task-modal'

import { useTasksBoard } from '@app/board/context'

namespace UpdateTaskModal {
  export type Props = Readonly<
    SetOptional<
      Pick<Task, 'name' | 'description' | 'dueDate' | 'id'>,
      'dueDate' | 'description' | 'name'
    > & {
      isOpen: boolean
      onClose: () => void
      onOpenChange: () => void
    }
  >
}

function UpdateTaskModal({
  id,
  name,
  description,
  dueDate,
  isOpen,
  onClose,
  onOpenChange,
}: UpdateTaskModal.Props) {
  const { updateTask } = useTasksBoard()

  async function formAction(data: TaskSchema) {
    await updateTask({ id, data })
  }

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      formAction={formAction}
      name={name}
      description={description}
      dueDate={dueDate}
    />
  )
}

export { UpdateTaskModal }
