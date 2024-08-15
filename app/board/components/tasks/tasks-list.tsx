import { TaskCard } from './task-card'

import type { PickedTask } from '@app/board/types'

namespace TasksList {
  export type Props = Readonly<{
    tasks: PickedTask[]
    header: string
  }>
}

function TasksList({ tasks, header }: TasksList.Props) {
  return (
    <div className="flex flex-col gap-2">
      <header>
        <h2 className="text-xl">{header}</h2>
      </header>

      <div>{`${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}</div>

      {tasks.map(({ id, name, isDone, dueDate, description }, index) => (
        <TaskCard
          key={id}
          id={id}
          index={index}
          name={name}
          isDone={isDone}
          dueDate={dueDate}
          description={description}
        />
      ))}
    </div>
  )
}

export { TasksList }
