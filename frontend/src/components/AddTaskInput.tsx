import { Alert, Box, Button, Paper, Snackbar, TextField } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useSetAtom } from 'jotai'
import { createTaskAtom } from '../state/state'
import { useState } from 'react'

const AddTaskInput = () => {
  const createTask = useSetAtom(createTaskAtom)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!title.trim()) return
    setBusy(true)
    try {
      await createTask(title)
      setTitle('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add task')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={busy}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddRoundedIcon />}
        sx={{ ml: '20px' }}
        disabled={busy || !title.trim()}
      >
        Add
      </Button>
      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AddTaskInput
