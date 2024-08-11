'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/button'
import { DatePicker } from '@nextui-org/date-picker'
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

import { addTaskAction } from '@app/board/actions'
const taskSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.string().date().optional(),
})

export function AddTaskModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const {
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof taskSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(taskSchema),
  })

  async function formAction(data: FormData) {
    const dueDate = data.get('dueDate')?.toString()

    const body = taskSchema.parse({
      name: data.get('name'),
      description: data.get('description'),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    await addTaskAction(body)

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

              <form action={formAction}>
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

                  <DatePicker
                    label="Due date"
                    name="dueDate"
                    variant="bordered"
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
