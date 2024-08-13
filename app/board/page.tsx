import { getTasks } from './actions/get-tasks.action'
import {
  AddTaskModal,
  ShowDoneTasksCheckbox,
  TasksBoard,
} from './components/tasks'
import { TasksBoardProvider } from './context'

import type { PageProps } from '@app/types/props'

namespace BoardPage {
  export interface Props extends PageProps {
    readonly searchParams: {
      'show-done'?: string
    }
  }
}

async function BoardPage({ searchParams }: BoardPage.Props) {
  const showDone = searchParams['show-done'] === 'true'

  const tasks = await getTasks()

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex justify-between">
        <h1 className="text-3xl">Your tasks</h1>

        <ShowDoneTasksCheckbox showDone={showDone} />
      </header>

      <TasksBoardProvider initialTasks={tasks}>
        <main className="flex flex-col gap-4">
          <TasksBoard showDone={showDone} />
        </main>

        <AddTaskModal />
      </TasksBoardProvider>
    </div>
  )
}

export default BoardPage
