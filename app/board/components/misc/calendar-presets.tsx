import { type DateValue } from '@internationalized/date'
import { Button, ButtonGroup } from '@nextui-org/button'
import type { Dispatch, SetStateAction } from 'react'

import { nextWeek, now, tomorrow } from '@app/board/helpers/date'

namespace CalendarPresets {
  export type Props = Readonly<{
    value?: DateValue
    setValue: Dispatch<SetStateAction<DateValue | undefined>>
  }>
}

function CalendarPresets({ value, setValue }: CalendarPresets.Props) {
  return (
    <ButtonGroup
      fullWidth
      size="sm"
      radius="full"
      variant="bordered"
      className="bg-content1 px-2 pt-2"
    >
      <Button
        onPress={() => {
          setValue(now)
        }}
        variant={value?.toString() === now.toString() ? 'solid' : 'bordered'}
      >
        Today
      </Button>

      <Button
        onPress={() => {
          setValue(tomorrow)
        }}
        variant={
          value?.toString() === tomorrow.toString() ? 'solid' : 'bordered'
        }
      >
        Tomorrow
      </Button>

      <Button
        onPress={() => {
          setValue(nextWeek)
        }}
        variant={
          value?.toString() === nextWeek.toString() ? 'solid' : 'bordered'
        }
      >
        Next week
      </Button>
    </ButtonGroup>
  )
}

export { CalendarPresets }
