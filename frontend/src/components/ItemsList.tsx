import { Box, Checkbox, IconButton, Paper, Typography } from '@mui/material'
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone'
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone'
import { useAtomValue, useSetAtom } from 'jotai'
import { tasksAtom, updateTaskAtom } from '../state/state'
import ConfirmDelete from './dialogs/ConfirmDelete'
import { useState } from 'react'
import EditTask from './dialogs/EditTask'
import type { Task, TaskStatus } from '../schemas'

const ItemsList = () => {
  const tasks = useAtomValue(tasksAtom)
  const updateTask = useSetAtom(updateTaskAtom)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [updatingTaskIds, setUpdatingTaskIds] = useState<number[]>([])

  return (
    <>
      <ConfirmDelete
        open={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
      />
      <EditTask
        key={taskToEdit?.id}
        open={taskToEdit !== null}
        onClose={() => setTaskToEdit(null)}
        task={taskToEdit}
      />
      {tasks.map((task) => {
        const { id, title, status } = task
        const isUpdating = updatingTaskIds.includes(id)
        return (
          <Box
            component={Paper}
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: '20px',
              p: '10px 20px',
              opacity: isUpdating ? 0.6 : 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Checkbox
                checked={status === 'done'}
                disabled={isUpdating}
                onChange={async (e) => {
                  const nextStatus: TaskStatus = e.target.checked ? 'done' : 'todo'
                  setUpdatingTaskIds((ids) => [...ids, id])
                  try {
                    await updateTask({ id, title, status: nextStatus })
                  } catch {
                    alert('Failed to update task')
                  } finally {
                    setUpdatingTaskIds((ids) => ids.filter((tid) => tid !== id))
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
              <IconButton aria-label="Edit task" onClick={() => setTaskToEdit(task)}>
                <CreateTwoToneIcon />
              </IconButton>
              <IconButton aria-label="Delete task" onClick={() => setTaskToDelete(task)}>
                <DeleteOutlineTwoToneIcon />
              </IconButton>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default ItemsList
