import { getDefaultStore } from 'jotai'
import {
  authResponseSchema,
  refreshResponseSchema,
  taskSchema,
  tasksSchema,
  userSchema,
  type AuthResponse,
  type Task,
  type TaskStatus,
  type User,
} from './schemas'
import { tokenAtom } from './state/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const contentType = 'application/json'

let onUnauthorized: (() => void) | null = null
let onNetworkError: (() => void) | null = null

export const setOnUnauthorized = (handler: () => void) => {
  onUnauthorized = handler
}

export const setOnNetworkError = (handler: () => void) => {
  onNetworkError = handler
}

export class NetworkError extends Error {
  constructor() {
    super('Cannot reach server')
    this.name = 'NetworkError'
  }
}

const safeFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  try {
    return await fetch(input, init)
  } catch {
    onNetworkError?.()
    throw new NetworkError()
  }
}

const authHeaders = (extra?: Record<string, string>) => {
  const token = getDefaultStore().get(tokenAtom)
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

const withAuthHeader = (init: RequestInit | undefined, token: string): RequestInit => ({
  ...init,
  headers: {
    ...(init?.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${token}`,
  },
})

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await safeFetch(`${API_URL}/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        if (!res.ok) return null
        const { token } = refreshResponseSchema.parse(await res.json())
        getDefaultStore().set(tokenAtom, token)
        return token
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

const authFetch = async (input: RequestInfo, init?: RequestInit) => {
  let res = await safeFetch(input, init)
  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      res = await safeFetch(input, withAuthHeader(init, newToken))
    }
    if (res.status === 401) {
      onUnauthorized?.()
      throw new Error('Unauthorized')
    }
  }
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res
}

export const getTasksList = async (): Promise<Task[]> => {
  const response = await authFetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: authHeaders(),
  })
  return tasksSchema.parse(await response.json())
}

export const createTask = async (title: string): Promise<Task> => {
  const response = await authFetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': contentType }),
    body: JSON.stringify({ title }),
  })
  return taskSchema.parse(await response.json())
}

export const deleteTask = async (id: number): Promise<void> => {
  await authFetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export const updateTask = async (
  id: number,
  title: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await authFetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': contentType }),
    body: JSON.stringify({ title, status }),
  })
  return taskSchema.parse(await response.json())
}

export const getMe = async (): Promise<User> => {
  const response = await authFetch(`${API_URL}/me`, {
    method: 'GET',
    headers: authHeaders(),
  })
  return userSchema.parse(await response.json())
}

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const res = await safeFetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return authResponseSchema.parse(await res.json())
}

export const register = async (username: string, password: string): Promise<void> => {
  const res = await safeFetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Registration failed')
}

export const apiLogout = async (): Promise<void> => {
  await safeFetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}
