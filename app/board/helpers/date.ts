import {
  today,
  getLocalTimeZone,
  startOfWeek,
  DateFormatter,
  type DateValue,
  fromDate,
} from '@internationalized/date'

import type { BoardKeyWithoutOverdue } from '../types'

export const now = today(getLocalTimeZone())
export const yesterday = now.add({ days: -1 })
export const tomorrow = now.add({ days: 1 })
export const nextWeek = startOfWeek(now.add({ weeks: 1 }), 'en-US')

export function formatDateValue(date: DateValue) {
  switch (true) {
    case date.compare(now) >= 0 && date.compare(tomorrow) < 0: {
      return 'Today'
    }

    case date.compare(tomorrow) >= 0 &&
      date.compare(tomorrow.add({ days: 1 })) < 0: {
      return 'Tomorrow'
    }

    case date.compare(yesterday) >= 0 &&
      date.compare(yesterday.add({ days: 1 })) < 0: {
      return 'Yesterday'
    }

    default: {
      return new DateFormatter('en-US', {
        day: 'numeric',
        month: 'long',
      }).format(date.toDate(getLocalTimeZone()))
    }
  }
}

export function dueDateFactory(
  destinationKey: Exclude<BoardKeyWithoutOverdue, 'done'>
) {
  switch (destinationKey) {
    case 'today': {
      return now.toDate(getLocalTimeZone())
    }
    case 'tomorrow': {
      return tomorrow.toDate(getLocalTimeZone())
    }
    case 'thisWeek': {
      return tomorrow.add({ days: 1 }).toDate(getLocalTimeZone())
    }
    case 'nextWeek': {
      return nextWeek.toDate(getLocalTimeZone())
    }
    case 'future': {
      return nextWeek.add({ days: 8 }).toDate(getLocalTimeZone())
    }
    case 'noDate': {
      return null
    }
  }
}

export function boardKeyFactory(dueDate?: Date | DateValue | string | null) {
  if (!dueDate) return 'noDate'

  const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate

  const dueDateValue = 'day' in date ? date : fromDate(date, getLocalTimeZone())

  switch (true) {
    case dueDateValue.compare(now) < 0: {
      return 'overdue'
    }
    case dueDateValue.compare(now) >= 0 && dueDateValue.compare(tomorrow) < 0: {
      return 'today'
    }
    case dueDateValue.compare(tomorrow) >= 0 &&
      dueDateValue.compare(tomorrow.add({ days: 1 })) < 0: {
      return 'tomorrow'
    }
    case dueDateValue.compare(tomorrow.add({ days: 1 })) >= 0 &&
      dueDateValue.compare(nextWeek) < 0: {
      return 'thisWeek'
    }
    case dueDateValue.compare(nextWeek) >= 0 &&
      dueDateValue.compare(nextWeek.add({ days: 7 })) < 0: {
      return 'nextWeek'
    }
    case dueDateValue.compare(nextWeek.add({ days: 7 })) > 0: {
      return 'future'
    }
    default: {
      return 'noDate'
    }
  }
}

export function isOverdue(date: DateValue) {
  return date.compare(now) < 0
}
