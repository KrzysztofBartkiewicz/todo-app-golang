import { useEffect, useState } from 'react'
import { getTasksList } from '../api'
import { Box, IconButton, SvgIcon, Typography } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useAtom } from 'jotai'
import { appModeAtom } from '../state/state'

interface Task {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'done'
}

const MainView = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasksList()
      setTasks(tasks)
    }
    fetchTasks()
  }, [])

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
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h1" component="h1">
          My Tasks
        </Typography>
      </Box>

      {tasks.map((task) => (
        <Box
          key={task.id}
          sx={{
            mb: '10px',
            p: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
        </Box>
      ))}
    </Box>
  )
}

export default MainView
