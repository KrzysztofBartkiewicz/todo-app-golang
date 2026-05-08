import { Box, IconButton, SvgIcon, Typography } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useAtom, useSetAtom } from 'jotai'
import { appModeAtom, fetchTasksAtom } from '../state/state'
import ItemsList from '../components/ItemsList'
import { useEffect } from 'react'
import AddTaskInput from '../components/AddTaskInput'

const MainView = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)

  const fetchTasks = useSetAtom(fetchTasksAtom)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <Box>
      <Box
        sx={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          onClick={() =>
            setAppMode((prev) => (prev === 'light' ? 'dark' : 'light'))
          }
        >
          <SvgIcon fontSize="large">
            {appMode === 'light' ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </SvgIcon>
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}>
        <Typography variant="h1" component="h1">
          My Tasks
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <AddTaskInput />
        <ItemsList />
      </Box>
    </Box>
  )
}

export default MainView
