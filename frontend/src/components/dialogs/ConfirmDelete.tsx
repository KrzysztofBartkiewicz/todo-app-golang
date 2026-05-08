import { Box, Button, Dialog, Typography } from '@mui/material'
import type { Task } from '../../interfaces/app'
import { deleteTaskAtom } from '../../state/state'
import { useSetAtom } from 'jotai'

interface ConfirmDeleteProps {
  open: boolean
  onClose: () => void
  taskId?: Task['id']
  taskTitle?: Task['title']
}

const ConfirmDelete = ({ open, onClose, taskId, taskTitle }: ConfirmDeleteProps) => {
  const deleteTask = useSetAtom(deleteTaskAtom)

  if (taskId == null) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { padding: '20px', textAlign: 'center' } } }}
    >
      <Typography component="h2">Are you sure you want to delete task?</Typography>
      <Typography variant="subtitle1">
        <b>{`${taskTitle}`}</b>
      </Typography>
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
          onClick={() => {
            deleteTask(taskId)
            onClose()
          }}
        >
          <Typography>Yes</Typography>
        </Button>

        <Button variant="outlined" fullWidth onClick={onClose}>
          <Typography>No</Typography>
        </Button>
      </Box>
    </Dialog>
  )
}

export default ConfirmDelete
