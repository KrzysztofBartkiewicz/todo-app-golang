import { Box, Button, Paper, TextField } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useAtom, useSetAtom } from 'jotai'
import { createTaskAtom, taskTitleAtom } from '../state/state'

const AddTaskInput = () => {
  const createTask = useSetAtom(createTaskAtom)
  const [taskTitle, setTaskTitle] = useAtom(taskTitleAtom)

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        createTask()
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: '20px',
      }}
    >
      <Box sx={{ flexGrow: 1 }} component={Paper}>
        <TextField
          placeholder="Add new task"
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </Box>
      <Button type="submit" variant="contained" startIcon={<AddRoundedIcon />} sx={{ ml: '20px' }}>
        Add
      </Button>
    </Box>
  )
}

export default AddTaskInput
