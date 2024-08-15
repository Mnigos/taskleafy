'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone } from '@internationalized/date'
import { Button } from '@nextui-org/button'
import { Input, Textarea } from '@nextui-org/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { LuPlusCircle } from 'react-icons/lu'
import { z } from 'zod'

import { AddTaskModalDatePicker } from './add-task-modal-date-picker'

import { useTasksBoard } from '@app/board/context'
import { now } from '@app/board/helpers/date'

const addTaskSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.coerce.date().min(now.toDate(getLocalTimeZone())).optional(),
})

export function AddTaskModal() {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof addTaskSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(addTaskSchema),
  })
  const { addTask } = useTasksBoard()

  async function formAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const dueDate = formData.get('dueDate')?.toString()

    const data = addTaskSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    setIsLoadingSubmit(true)

    await addTask(data)

    reset()

    setIsLoadingSubmit(false)

    onClose()
  }

  return (
    <>
      <Button
        className="fixed bottom-5 right-5"
        color="primary"
        onPress={onOpen}
      >
        <LuPlusCircle />
        Add task
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add task
              </ModalHeader>

              <form onSubmit={formAction}>
                <ModalBody>
                  <Input
                    label="Task name"
                    isRequired
                    {...register('name')}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message?.toString()}
                    variant="bordered"
                  />

                  <Textarea
                    label="Description"
                    {...register('description')}
                    variant="bordered"
                  />

                  <AddTaskModalDatePicker />
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>

                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={isLoadingSubmit}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
