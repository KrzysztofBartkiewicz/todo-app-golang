export type AppMode = 'light' | 'dark'

export interface Task {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'done'
}
