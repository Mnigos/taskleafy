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
import { useForm } from 'react-hook-form'
import { LuPlusCircle } from 'react-icons/lu'
import { z } from 'zod'
import { useRef } from 'react'

import { AddTaskModalDatePicker } from './add-task-modal-date-picker'

import { now } from '@app/board/helpers/date'
import { useTasksBoard } from '@app/board/context'

const addTaskSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.coerce.date().min(now.toDate(getLocalTimeZone())).optional(),
})

export function AddTaskModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof addTaskSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(addTaskSchema),
  })
  const { addTask } = useTasksBoard()
  const formReference = useRef<HTMLFormElement>(null)

  function formAction(formData: FormData) {
    const dueDate = formData.get('dueDate')?.toString()

    const data = addTaskSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    addTask(data)

    formReference.current?.reset()

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

              <form ref={formReference} action={formAction}>
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
                    formAction={formAction}
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
