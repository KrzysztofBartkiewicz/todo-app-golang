import { Box } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { fetchTasksAtom, tasksAtom } from '../state/state'
import ItemsList from '../components/ItemsList'
import { useEffect } from 'react'
import AddTaskInput from '../components/AddTaskInput'
import EmptyState from '../components/EmptyState'
import AppModeButton from '../components/AppModeButton'
import Header from '../components/Header'

const MainView = () => {
  const tasks = useAtomValue(tasksAtom)
  const fetchTasks = useSetAtom(fetchTasksAtom)

  const isEmpty = tasks.length === 0

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <Box>
      <AppModeButton />
      <Header isEmpty={isEmpty} />
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <AddTaskInput />
        {!isEmpty && <ItemsList />}
      </Box>
      {isEmpty && <EmptyState />}
    </Box>
  )
}

export default MainView
