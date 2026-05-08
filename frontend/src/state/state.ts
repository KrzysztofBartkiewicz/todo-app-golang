import { atomWithStorage } from 'jotai/utils'
import type { AppMode, Task } from '../interfaces/app'
import { atom } from 'jotai'
import { createTask, deleteTask, getTasksList, updateTask } from '../api'

export const appModeAtom = atomWithStorage<AppMode>('appMode', 'light', undefined, {
  getOnInit: true,
})

export const tasksAtom = atom<Task[]>([])
export const taskTitleAtom = atom('')

export const fetchTasksAtom = atom(null, async (_get, set) => {
  const tasks = await getTasksList()
  set(tasksAtom, tasks)
})

export const createTaskAtom = atom(null, async (get, set) => {
  const title = get(taskTitleAtom)
  if (!title) return

  await createTask(title)
  set(taskTitleAtom, '')
  await set(fetchTasksAtom)
})

export const deleteTaskAtom = atom(null, async (_get, set, taskID: number) => {
  if (taskID == null) return

  await deleteTask(taskID)
  await set(fetchTasksAtom)
})

export const updateTaskAtom = atom(
  null,
  async (
    _get,
    set,
    { id, title, status }: { id: number; title: string; status: Task['status'] }
  ) => {
    if (id == null) return

    await updateTask(id, title, status)
    await set(fetchTasksAtom)
  }
)
