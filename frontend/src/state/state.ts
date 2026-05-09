import { atomWithStorage } from 'jotai/utils'
import type { AppMode } from '../interfaces/app'
import { atom } from 'jotai'
import { createTask, deleteTask, getTasksList, updateTask } from '../api'
import type { Task, TaskStatus } from '../schemas'

export const appModeAtom = atomWithStorage<AppMode>('appMode', 'light', undefined, {
  getOnInit: true,
})

export const tasksAtom = atom<Task[]>([])

export const fetchTasksAtom = atom(null, async (_get, set) => {
  const tasks = await getTasksList()
  set(tasksAtom, tasks)
})

export const createTaskAtom = atom(null, async (_get, set, title: string) => {
  const trimmed = title.trim()
  if (!trimmed) return
  await createTask(trimmed)
  await set(fetchTasksAtom)
})

export const deleteTaskAtom = atom(null, async (_get, set, taskId: number) => {
  await deleteTask(taskId)
  await set(fetchTasksAtom)
})

export const updateTaskAtom = atom(
  null,
  async (
    _get,
    set,
    { id, title, status }: { id: number; title: string; status: TaskStatus }
  ) => {
    await updateTask(id, title, status)
    await set(fetchTasksAtom)
  }
)
