import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'done'])

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: taskStatusSchema,
})

export const tasksSchema = z.array(taskSchema)

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
})

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
})

export const refreshResponseSchema = z.object({
  token: z.string(),
})

export type Task = z.infer<typeof taskSchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type RefreshResponse = z.infer<typeof refreshResponseSchema>
export type User = z.infer<typeof userSchema>
