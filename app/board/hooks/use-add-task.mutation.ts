import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addTask } from '../actions'

export function useAddTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTask,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['tasks'] })
    },
  })
}
