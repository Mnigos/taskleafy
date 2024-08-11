'use client'

import { Card, CardHeader } from '@nextui-org/card'
import { Checkbox } from '@nextui-org/checkbox'
import type { Task } from '@prisma/client'
import { cn } from '@nextui-org/theme'

import { markTaskAsDoneAction } from '../../actions'

namespace TaskCard {
  export type Props = Pick<Task, 'id' | 'name' | 'isDone'>
}

function TaskCard({ id, name, isDone }: TaskCard.Props) {
  return (
    <Card>
      <CardHeader className={cn(isDone && 'opacity-50')}>
        <Checkbox
          color="primary"
          defaultSelected={isDone}
          isDisabled={isDone}
          onClick={() => !isDone && markTaskAsDoneAction(id)}
        />

        {name}
      </CardHeader>
    </Card>
  )
}

export { TaskCard }
