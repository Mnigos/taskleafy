import { rescheduleOverdueTasks } from './reschedule-overdue-tasks.action'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/db')
vi.mock('@app/auth/helpers')

describe('RescheduleOverdueTasksAction', () => {
  const userId = '1'
  const prismaMock = vi.mocked(prisma)
  const getServerUserSpy = vi
    .mocked(getServerUser)
    .mockResolvedValue(userMockFactory(userId))

  test('should reschedule overdue tasks', async () => {
    const dueDate = new Date()
    const updateManySpy = vi.spyOn(prismaMock.task, 'updateMany')

    await rescheduleOverdueTasks({
      dueDate,
    })

    expect(getServerUserSpy).toHaveBeenCalled()
    expect(updateManySpy).toHaveBeenCalledWith({
      where: {
        dueDate: {
          lt: new Date(),
        },
        userId,
      },
      data: {
        dueDate,
      },
    })
  })
})
