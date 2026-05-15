import { Box, CircularProgress } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { fetchTasksAtom, tasksAtom } from '../state/state'
import ItemsList from '../components/ItemsList'
import { useEffect, useState } from 'react'
import AddTaskInput from '../components/AddTaskInput'
import EmptyState from '../components/EmptyState'
import AppModeButton from '../components/AppModeButton'
import Header from '../components/Header'
import { currentUserAtom, fetchCurrentUserAtom } from '../state/auth'

const MainView = () => {
  const tasks = useAtomValue(tasksAtom)
  const fetchTasks = useSetAtom(fetchTasksAtom)
  const fetchCurrentUser = useSetAtom(fetchCurrentUserAtom)
  const currentUser = useAtomValue(currentUserAtom)
  const [loading, setLoading] = useState(true)

  const isEmpty = tasks.length === 0

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser().catch(() => {})
    }
  }, [currentUser, fetchCurrentUser])

  useEffect(() => {
    let cancelled = false
    fetchTasks()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchTasks])

  return (
    <Box>
      <AppModeButton />
      <Header isEmpty={isEmpty} />
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <AddTaskInput />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '40px' }}>
            <CircularProgress />
          </Box>
        ) : (
          !isEmpty && <ItemsList />
        )}
      </Box>
      {!loading && isEmpty && <EmptyState />}
    </Box>
  )
}

export default MainView
