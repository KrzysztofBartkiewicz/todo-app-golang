import { Box, Checkbox, IconButton, Paper, Typography } from '@mui/material'
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone'
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import { useAtomValue } from 'jotai'
import { tasksAtom } from '../state/state'
import ConfirmDelete from './dialogs/ConfirmDelete'
import { useState } from 'react'
import EditTask from './dialogs/EditTask'

const ItemsList = () => {
  const tasks = useAtomValue(tasksAtom)
  const [taskIDToDelete, setTaskIDToDelete] = useState<{
    id: number
    title: string
  } | null>(null)
  const [taskIDToEdit, setTaskIDToEdit] = useState<{
    id: number
    title: string
  } | null>(null)

  return (
    <>
      <ConfirmDelete
        open={taskIDToDelete !== null}
        onClose={() => setTaskIDToDelete(null)}
        taskId={taskIDToDelete?.id}
        taskTitle={taskIDToDelete?.title}
      />
      <EditTask
        open={taskIDToEdit !== null}
        onClose={() => setTaskIDToEdit(null)}
        taskId={taskIDToEdit?.id}
        taskTitle={taskIDToEdit?.title}
      />
      {tasks.map(({ id, title, status }) => (
        <Box
          component={Paper}
          key={id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: '20px',
            p: '10px 20px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Checkbox checked={status === 'done'} />
            <Typography>{title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <IconButton onClick={() => setTaskIDToEdit({ id, title })}>
              <CreateTwoToneIcon />
            </IconButton>
            <IconButton onClick={() => setTaskIDToDelete({ id, title })}>
              <DeleteOutlineTwoToneIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default ItemsList
