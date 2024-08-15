import { zodResolver } from '@hookform/resolvers/zod'
import {
  fromDate,
  getLocalTimeZone,
  parseZonedDateTime,
} from '@internationalized/date'
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
import type { Task } from '@prisma/client'
import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { SetOptional } from 'type-fest'
import { z } from 'zod'

import { AddTaskModalDatePicker } from './add-task-modal-date-picker'

import { now } from '@app/board/helpers/date'
import { useTasksBoard } from '@app/board/context'

const updateTaskSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().min(now.toDate(getLocalTimeZone())).optional(),
})

namespace UpdateTaskModal {
  export type Props = Readonly<
    SetOptional<
      Pick<Task, 'name' | 'description' | 'dueDate' | 'id'>,
      'dueDate' | 'description' | 'name'
    > & {
      isOpen: boolean
      closeModal: () => void
    }
  >
}

function UpdateTaskModal({
  id,
  name,
  description,
  dueDate,
  isOpen,
  closeModal,
}: UpdateTaskModal.Props) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const { onOpenChange } = useDisclosure()
  const {
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof updateTaskSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(updateTaskSchema),
  })
  const { updateTask } = useTasksBoard()

  async function formAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const dueDateFormValue = formData.get('dueDate')?.toString()

    const dueDateValue = dueDateFormValue
      ? parseZonedDateTime(dueDateFormValue).toDate()
      : undefined

    const data = updateTaskSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      ...(dueDateValue === dueDate ? {} : { dueDate: dueDateValue }),
    })

    setIsLoadingSubmit(true)

    await updateTask({ id, data })

    reset()

    setIsLoadingSubmit(false)

    closeModal()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={closeModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add task</ModalHeader>

            <form onSubmit={formAction}>
              <ModalBody>
                <Input
                  label="Task name"
                  isRequired
                  {...register('name')}
                  defaultValue={name}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message?.toString()}
                  variant="bordered"
                />

                <Textarea
                  label="Description"
                  defaultValue={description ?? undefined}
                  {...register('description')}
                  variant="bordered"
                />

                <AddTaskModalDatePicker
                  defaultValue={
                    dueDate ? fromDate(dueDate, getLocalTimeZone()) : undefined
                  }
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                  Close
                </Button>

                <Button
                  color="primary"
                  type="submit"
                  isDisabled={!isValid}
                  isLoading={isLoadingSubmit}
                >
                  Update
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export { UpdateTaskModal }
