import { useState, useCallback } from 'react'

const API_URL = 'http://localhost:8080'

export interface Task {
  id: number
  title?: string
  status?: string
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/tasks`)
      const data = await res.json()
      setTasks(data)
      return data
    } catch (err) {
      setError('Error fetching tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (title: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await res.json()
      setTasks((prev) => [...prev, data])
      return data
    } catch (err) {
      setError('Error creating task')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTask = useCallback(
    async (id: number, data: { title?: string; status?: string }) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const updated = await res.json()
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
        return updated
      } catch (err) {
        setError('Error updating task')
        console.error('Error updating task:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      })
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError('Error deleting task')
      console.error('Error deleting task:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { tasks, loading, error, getTasks, createTask, updateTask, deleteTask }
}

export default useTasks
