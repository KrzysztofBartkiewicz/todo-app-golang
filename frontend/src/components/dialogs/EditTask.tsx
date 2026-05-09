import { Box, Button, Dialog, TextField, Typography } from '@mui/material'
import type { Task } from '../../schemas'
import { updateTaskAtom } from '../../state/state'
import { useSetAtom } from 'jotai'
import { useState } from 'react'

interface EditTaskProps {
  open: boolean
  onClose: () => void
  task: Task | null
}

const EditTask = ({ open, onClose, task }: EditTaskProps) => {
  const updateTask = useSetAtom(updateTaskAtom)
  const [title, setTitle] = useState(task?.title ?? '')

  if (!task) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { padding: '20px', textAlign: 'center', minWidth: '600px' } } }}
    >
      <Typography component="h2">You are going to edit task:</Typography>
      <Typography variant="subtitle1" sx={{ mb: '20px' }}>
        <b>{task.title}</b>
      </Typography>
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          mt: '20px',
        }}
      >
        <Button
          variant="contained"
          fullWidth
          disabled={!title.trim()}
          onClick={() => {
            updateTask({ id: task.id, title: title.trim(), status: task.status })
            onClose()
          }}
        >
          <Typography>Update</Typography>
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose}>
          <Typography>Cancel</Typography>
        </Button>
      </Box>
    </Dialog>
  )
}

export default EditTask
