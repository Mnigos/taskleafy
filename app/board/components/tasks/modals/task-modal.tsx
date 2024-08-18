'use client'

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
} from '@nextui-org/modal'
import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TaskDatePicker } from '../task-date-picker'

import { now } from '@app/board/helpers/date'

const taskSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.coerce.date().min(now.toDate(getLocalTimeZone())).optional(),
})

export type TaskSchema = z.infer<typeof taskSchema>

namespace TaskModal {
  export type Props = Readonly<{
    isOpen: boolean
    onClose: () => void
    onOpenChange: () => void
    name?: string | null
    description?: string | null
    dueDate?: Date | null
    formAction: (data: TaskSchema) => Promise<void>
  }>
}

function TaskModal({
  isOpen,
  onClose,
  onOpenChange,
  name,
  description,
  dueDate,
  formAction,
}: TaskModal.Props) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const {
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<TaskSchema>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(taskSchema),
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const dueDateFormValue = formData.get('dueDate')?.toString()

    console.log(dueDateFormValue)

    const dueDateValue = dueDateFormValue
      ? dueDateFormValue.includes('[')
        ? parseZonedDateTime(dueDateFormValue).toDate()
        : new Date(dueDateFormValue)
      : undefined

    const data = taskSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      ...(dueDateValue === dueDate ? {} : { dueDate: dueDateValue }),
    })

    setIsLoadingSubmit(true)

    await formAction(data)

    reset()

    setIsLoadingSubmit(false)

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add task</ModalHeader>

            <form onSubmit={handleSubmit}>
              <ModalBody>
                <Input
                  label="Task name"
                  isRequired
                  {...register('name')}
                  defaultValue={name ?? undefined}
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

                <TaskDatePicker
                  defaultValue={
                    dueDate ? fromDate(dueDate, getLocalTimeZone()) : undefined
                  }
                />
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
                  {name ? 'Update' : 'Add'}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export { TaskModal }
