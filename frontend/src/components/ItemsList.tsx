import { Box, Checkbox, IconButton, Paper, Typography } from '@mui/material'
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone'
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import { useAtomValue, useSetAtom } from 'jotai'
import { tasksAtom, updateTaskAtom } from '../state/state'
import ConfirmDelete from './dialogs/ConfirmDelete'
import { useState } from 'react'
import EditTask from './dialogs/EditTask'
import type { Task } from '../interfaces/app'

const ItemsList = () => {
  const tasks = useAtomValue(tasksAtom)
  const updateTask = useSetAtom(updateTaskAtom)
  const [taskIDToDelete, setTaskIDToDelete] = useState<{
    id: number
    title: string
  } | null>(null)
  const [taskIDToEdit, setTaskIDToEdit] = useState<{
    id: number
    title: string
  } | null>(null)
  const [updatingTaskIds, setUpdatingTaskIds] = useState<number[]>([])

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
            opacity: updatingTaskIds.includes(id) ? 0.6 : 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Checkbox
              checked={status === 'done'}
              disabled={updatingTaskIds.includes(id)}
              onChange={async (e) => {
                const isChecked = e.target.checked
                const nextStatus: Task['status'] = isChecked ? 'done' : 'todo'

                setUpdatingTaskIds((ids) => [...ids, id])

                try {
                  await updateTask({ id, title, status: nextStatus })
                } catch {
                  alert('Failed to update task')
                } finally {
                  setUpdatingTaskIds((ids) => ids.filter((taskId) => taskId !== id))
                }
              }}
            />
            <Typography
              sx={{
                textDecoration: status === 'done' ? 'line-through' : 'none',
                opacity: status === 'done' ? 0.6 : 1,
              }}
            >
              {title}
            </Typography>
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
