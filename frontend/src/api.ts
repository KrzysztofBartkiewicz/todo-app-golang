import type { Task } from './interfaces/app'

const API_URL = 'http://localhost:8080'
const contentType = 'application/json'

export const getTasksList = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
  })
  return response.json()
}

export const createTask = async (title: string) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: JSON.stringify({ title }),
  })
  return response.json()
}

export const deleteTask = async (id: number) => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
}

export const updateTask = async (id: number, title: string, status: Task['status']) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': contentType,
    },
    body: JSON.stringify({ title, status }),
  })
  return response.json()
}
