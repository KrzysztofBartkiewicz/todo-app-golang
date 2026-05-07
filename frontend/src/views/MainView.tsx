import { useEffect, useState } from 'react'
import { getTasksList } from '../api'
import { Box } from '@mui/material'

interface Task {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'done'
}

const MainView = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasksList()
      setTasks(tasks)
    }
    fetchTasks()
  }, [])

  return (
    <Box sx={{ p: '30px' }}>
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
