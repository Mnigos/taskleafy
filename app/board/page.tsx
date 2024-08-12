import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { redirect } from 'next/navigation'

import { AddTaskModal, ShowDoneTasksCheckbox } from './components/tasks'
import { TasksList } from './components/tasks/tasks-list'
import { now, tomorrow } from './helpers/date'

import { auth } from '@app/auth'
import { prisma } from '@app/db'
import type { PageProps } from '@app/types/props'

namespace BoardPage {
  export interface Props extends PageProps {
    readonly searchParams: {
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

  const overdueTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day < now.day
  )
  const todayTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day === now.day
  )
  const tomorrowTasks = tasks.filter(
    task =>
      task.dueDate &&
      !task.isDone &&
      fromDate(task.dueDate, getLocalTimeZone()).day === tomorrow.day
  )
  const noDateTasks = tasks.filter(task => !task.dueDate && !task.isDone)
  const doneTasks = tasks.filter(task => task.isDone)

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex justify-between">
        <h1 className="text-3xl">Your tasks</h1>

        <ShowDoneTasksCheckbox showDone={showDone} />
      </header>

      <main className="flex flex-col gap-4">
        {overdueTasks.length > 0 && (
          <TasksList tasks={overdueTasks} header="Overdue" />
        )}

        {todayTasks.length > 0 && (
          <TasksList tasks={todayTasks} header="Today" />
        )}

        {tomorrowTasks.length > 0 && (
          <TasksList tasks={tomorrowTasks} header="Tomorrow" />
        )}

        {noDateTasks.length > 0 && (
          <TasksList tasks={noDateTasks} header="No date" />
        )}

        {doneTasks.length > 0 && showDone && (
          <TasksList tasks={doneTasks} header="Done" />
        )}
      </main>

      <AddTaskModal />
    </div>
  )
}

export default BoardPage
