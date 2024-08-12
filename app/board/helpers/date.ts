import { today, getLocalTimeZone, startOfWeek } from '@internationalized/date'

export const now = today(getLocalTimeZone())
export const tomorrow = now.add({ days: 1 })
export const nextWeek = startOfWeek(now.add({ weeks: 1 }), 'en-US')
