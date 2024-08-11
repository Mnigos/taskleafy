import { redirect } from 'next/navigation'

import {
  ShowDoneTasksCheckbox,
  TaskCard,
  AddTaskModal,
} from './components/tasks'

import { auth } from '@app/auth'
import { prisma } from '@app/db'
import type { PageProps } from '@app/types/props'

namespace BoardPage {
  export interface Props extends PageProps {
    searchParams: {
      'show-done'?: string
    }
  }
}

async function BoardPage({ searchParams }: BoardPage.Props) {
  const session = await auth()

  const showDone = searchParams['show-done'] === 'true'

  if (!session?.user?.id) redirect('/')

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
  })

  const unDoneTasks = tasks.filter(task => !task.isDone)
  const doneTasks = tasks.filter(task => task.isDone)

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex justify-between">
        <h1 className="text-3xl">Your tasks</h1>

        <ShowDoneTasksCheckbox showDone={showDone} />
      </header>

      <main className="flex flex-col gap-4">
        {unDoneTasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <div>
              {unDoneTasks.length} {unDoneTasks.length === 1 ? 'task' : 'tasks'}
            </div>

            {unDoneTasks.map(({ id, name, isDone }) => (
              <TaskCard key={id} id={id} name={name} isDone={isDone} />
            ))}
          </div>
        )}

        {doneTasks.length > 0 && showDone && (
          <div className="flex flex-col gap-2">
            <div>
              {doneTasks.length} done{' '}
              {doneTasks.length === 1 ? 'task' : 'tasks'}
            </div>

            {doneTasks.map(({ id, name, isDone }) => (
              <TaskCard key={id} id={id} name={name} isDone={isDone} />
            ))}
          </div>
        )}
      </main>

      <AddTaskModal />
    </div>
  )
}

export default BoardPage
