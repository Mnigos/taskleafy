import type { Task } from '@prisma/client'
import { mock } from 'vitest-mock-extended'

import { getTasks } from './get-tasks.action'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/db')
vi.mock('@app/auth/helpers')

describe('GetTasksAction', () => {
  const userId = '1'
  const prismaMock = vi.mocked(prisma)
  const getServerUserSpy = vi
    .mocked(getServerUser)
    .mockResolvedValue(userMockFactory(userId))

  test('should get tasks', async () => {
    const tasks = mock<Task[]>([
      {
        id: '1',
        name: 'Task 1',
      },
      {
        id: '2',
        name: 'Task 2',
      },
    ])

    const findManySpy = vi
      .spyOn(prismaMock.task, 'findMany')
      .mockResolvedValue(tasks)

    expect(await getTasks()).toEqual(tasks)
    expect(getServerUserSpy).toHaveBeenCalled()
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        userId,
      },
    })
  })
})
