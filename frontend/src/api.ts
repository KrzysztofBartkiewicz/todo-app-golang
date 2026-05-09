import type { Task } from './interfaces/app'

const API_URL = 'http://localhost:8080'
const contentType = 'application/json'

const authHeaders = (extra?: Record<string, string>) => {
  const token = localStorage.getItem('token')
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

const authFetch = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init)
  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:expired'))
    throw new Error('Unauthorized')
  }
  return res
}

export const getTasksList = async () => {
  const response = await authFetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: authHeaders(),
  })
  return response.json()
}

export const createTask = async (title: string) => {
  const response = await authFetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': contentType }),
    body: JSON.stringify({ title }),
  })
  return response.json()
}

export const deleteTask = async (id: number) => {
  await authFetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export const updateTask = async (id: number, title: string, status: Task['status']) => {
  const response = await authFetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': contentType }),
    body: JSON.stringify({ title, status }),
  })
  return response.json()
}

export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    throw new Error('Invalid credentials')
  }

  const data = await res.json()

  return data
}

export const register = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    throw new Error('Registration failed')
  }

  const data = await res.json()

  return data
}
