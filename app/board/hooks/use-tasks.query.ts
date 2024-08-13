import { useQuery } from '@tanstack/react-query'
import type { Task } from '@prisma/client'

import { getTasks } from '../actions'

export function useTasksQuery(initialData: Task[]) {
  return useQuery({
    queryKey: ['tasks'],
    initialData,
    queryFn: getTasks,
    refetchOnMount: true,
  })
}
