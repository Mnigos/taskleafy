import { fromDate, getLocalTimeZone } from '@internationalized/date'

import {
  boardKeyFactory,
  dueDateFactory,
  formatDateValue,
  isOverdue,
  nextWeek,
  now,
  tomorrow,
  yesterday,
} from './date'

describe('DateHelpers', () => {
  const customDateValue = fromDate(new Date('1/1/2022'), getLocalTimeZone())

  describe('formatDateValue', () => {
    test('should return "Today" for today', () => {
      expect(formatDateValue(now)).toEqual('Today')
    })

    test('should return "Tomorrow" for tomorrow', () => {
      expect(formatDateValue(tomorrow)).toEqual('Tomorrow')
    })

    test('should return "Yesterday" for yesterday', () => {
      expect(formatDateValue(yesterday)).toEqual('Yesterday')
    })

    test('should return date in English', () => {
      expect(formatDateValue(customDateValue)).toEqual('January 1')
    })
  })

  describe('dueDateFactory', () => {
    test('should return null for "noDate"', () => {
      expect(dueDateFactory('noDate')).toBeNull()
    })

    test('should return tomorrow for "tomorrow"', () => {
      expect(dueDateFactory('tomorrow')).toEqual(
        tomorrow.toDate(getLocalTimeZone())
      )
    })

    test('should return next week for "nextWeek"', () => {
      expect(dueDateFactory('nextWeek')).toEqual(
        nextWeek.toDate(getLocalTimeZone())
      )
    })

    test('should return future for "future"', () => {
      expect(dueDateFactory('future')).toEqual(
        nextWeek.add({ days: 8 }).toDate(getLocalTimeZone())
      )
    })

    test('should return today for "today"', () => {
      expect(dueDateFactory('today')).toEqual(now.toDate(getLocalTimeZone()))
    })
  })

  describe('boardKeyFactory', () => {
    test('should return "today" for today', () => {
      expect(boardKeyFactory(now)).toEqual('today')
    })

    test('should return "tomorrow" for tomorrow', () => {
      expect(boardKeyFactory(tomorrow)).toEqual('tomorrow')
    })

    test('should return "thisWeek" for tomorrow plus one day', () => {
      expect(boardKeyFactory(tomorrow.add({ days: 1 }))).toEqual('thisWeek')
    })

    test('should return "nextWeek" for next week', () => {
      expect(boardKeyFactory(nextWeek)).toEqual('nextWeek')
    })

    test('should return "overdue" for yesterday', () => {
      expect(boardKeyFactory(yesterday)).toEqual('overdue')
    })

    test('should return "noDate" for other nullish values', () => {
      expect(boardKeyFactory(null)).toEqual('noDate')
      expect(boardKeyFactory(undefined)).toEqual('noDate')
    })
  })

  describe('isOverdue', () => {
    test('should return true for yesterday', () => {
      expect(isOverdue(yesterday)).toBe(true)
    })

    test('should return false for today', () => {
      expect(isOverdue(now)).toBe(false)
    })
  })
})
