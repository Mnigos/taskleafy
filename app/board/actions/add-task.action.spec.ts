import type { Task } from '@prisma/client'
import { mock } from 'vitest-mock-extended'

import { addTask } from './add-task.action'

import { getServerUser } from '@app/auth/helpers'
import { prisma } from '@app/db'
import { userMockFactory } from '@tests/mocks'

vi.mock('@app/db')
vi.mock('@app/auth/helpers')

describe('AddTaskAction', () => {
  const userId = '1'
  const prismaMock = vi.mocked(prisma)
  const getServerUserSpy = vi
    .mocked(getServerUser)
    .mockResolvedValue(userMockFactory(userId))

  test('should add task', async () => {
    const taskMock = mock<Task>()

    const createSpy = vi
      .spyOn(prismaMock.task, 'create')
      .mockResolvedValue(taskMock)

    expect(await addTask({ name: 'Task 1' })).toEqual(taskMock)
    expect(getServerUserSpy).toHaveBeenCalled()
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        name: 'Task 1',
        userId: '1',
      },
    })
  })
})
