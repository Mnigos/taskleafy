import type { Task } from '@prisma/client'
import { mock } from 'vitest-mock-extended'

import { getTask } from './get-task.action'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/db')
vi.mock('@app/auth/helpers')

describe('GetTaskAction', () => {
  const userId = '1'
  const prismaMock = vi.mocked(prisma)
  const getServerUserSpy = vi
    .mocked(getServerUser)
    .mockResolvedValue(userMockFactory(userId))

  test('should get task', async () => {
    const taskId = '1'
    const taskMock = mock<Task>()

    const findUniqueSpy = vi
      .spyOn(prismaMock.task, 'findUnique')
      .mockResolvedValue(taskMock)

    expect(await getTask(taskId)).toEqual(taskMock)
    expect(getServerUserSpy).toHaveBeenCalled()
    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: {
        id: taskId,
        userId,
      },
    })
  })
})
