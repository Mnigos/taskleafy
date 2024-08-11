'use client'

import { Checkbox } from '@nextui-org/checkbox'
import { useRouter } from 'next/navigation'

namespace ShowDoneTasksCheckbox {
  export interface Props {
    showDone: boolean
  }
}

function ShowDoneTasksCheckbox({ showDone }: ShowDoneTasksCheckbox.Props) {
  const router = useRouter()

  return (
    <Checkbox
      onChange={({ target: { checked } }) => {
        router.push(`/board?show-done=${checked}`)
      }}
      defaultSelected={showDone}
    >
      Show done tasks
    </Checkbox>
  )
}

export { ShowDoneTasksCheckbox }
