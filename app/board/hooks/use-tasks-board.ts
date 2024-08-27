import { useContext } from 'react'

import { TasksBoardContext } from '../context'

export const useTasksBoard = () => useContext(TasksBoardContext)
