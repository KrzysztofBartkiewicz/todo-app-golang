import { useEffect, useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CommentIcon from '@mui/icons-material/Comment'
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import AddItem from '../dialogs/AddItem'
import useTasks from '../hooks/useApi'

const MainView = () => {
  const [checked, setChecked] = useState<number[]>([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { tasks, loading, getTasks, createTask } = useTasks()

  useEffect(() => {
    getTasks()
  }, [getTasks])

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

  return (
    <>
      <AddItem isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} createTask={createTask} />
      <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
        <List>
          {!loading &&
            tasks.map(({ id, title, status }) => (
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
                        input: {
                          'aria-labelledby': `checkbox-list-label-${id}`,
                        },
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
        <AddCircleIcon
          color="primary"
          sx={{ fontSize: 60, position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        />
      </Box>
    </>
  )
}

export default MainView
