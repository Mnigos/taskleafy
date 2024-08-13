import { useMutation, useQueryClient } from '@tanstack/react-query'
import { revalidatePath } from 'next/cache'

import { updateTask } from '../actions'

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      revalidatePath('/board')

      await queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
    },
  })
}
