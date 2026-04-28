import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getTasks } from '../api.ts'
import CommentIcon from '@mui/icons-material/Comment'

interface Task {
  id: number
  title?: string
  status?: string
}

const MainView = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [checked, setChecked] = useState<number[]>([])

  const handleToggle = (id: number) => () => {
    const currentIndex = checked.indexOf(id)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(id)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks()
      setTasks(tasks)
    }

    fetchTasks()
  }, [])

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <List>
        {tasks.map(({ id, title, status }) => (
          <ListItem
            key={id}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
          >
            <ListItemButton role={undefined} dense onClick={handleToggle(id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(id) !== -1}
                  tabIndex={-1}
                  slotProps={{
                    input: { 'aria-labelledby': `checkbox-list-label-${id}` },
                  }}
                />
              </ListItemIcon>
              <ListItemText id={`checkbox-list-label-${id}`} primary={title} />
              <ListItemText
                primary={status}
                sx={{
                  '& span': {
                    fontWeight: 700,
                    color: status === 'completed' ? 'green' : 'red',
                    textTransform: 'uppercase',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default MainView
