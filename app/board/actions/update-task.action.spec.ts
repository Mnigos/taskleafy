import type { Task } from '@prisma/client'
import { mock } from 'vitest-mock-extended'

import { updateTask } from './update-task.action'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/db')
vi.mock('@app/auth/helpers')

describe('UpdateTaskAction', () => {
  const userId = '1'
  const prismaMock = vi.mocked(prisma)
  const getServerUserSpy = vi
    .mocked(getServerUser)
    .mockResolvedValue(userMockFactory(userId))

  test('should update task', async () => {
    const taskId = '1'
    const taskMock = mock<Task>()
    const data = {
      name: 'Task 1',
    }

    const updateSpy = vi
      .spyOn(prismaMock.task, 'update')
      .mockResolvedValue(taskMock)

    expect(await updateTask({ id: taskId, data })).toEqual(taskMock)
    expect(getServerUserSpy).toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalledWith({
      where: {
        id: taskId,
        userId,
      },
      data,
    })
  })
})
