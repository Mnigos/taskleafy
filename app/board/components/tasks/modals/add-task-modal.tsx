'use client'

import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { LuPlusCircle } from 'react-icons/lu'

import { TaskModal, type TaskSchema } from './task-modal'

import { useTasksBoard } from '@app/board/context'

export function AddTaskModal() {
  const { onOpen, onOpenChange, isOpen, onClose } = useDisclosure()
  const { addTask } = useTasksBoard()

  async function formAction(data: TaskSchema) {
    await addTask(data)
  }

  return (
    <>
      <Button
        className="fixed bottom-5 right-5 z-10"
        color="primary"
        onPress={onOpen}
      >
        <LuPlusCircle />
        Add task
      </Button>

      <TaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        formAction={formAction}
      />
    </>
  )
}
