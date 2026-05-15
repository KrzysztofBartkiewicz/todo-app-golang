import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { getMe } from '../api'
import type { User } from '../schemas'

export const tokenAtom = atomWithStorage<string | null>('token', null, undefined, {
  getOnInit: true,
})

export const currentUserAtom = atom<User | null>(null)

export const userNameAtom = atom((get) => get(currentUserAtom)?.username ?? null)

export const fetchCurrentUserAtom = atom(null, async (_get, set) => {
  const user = await getMe()
  set(currentUserAtom, user)
})

const decodeTokenExp = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export const tokenExpMsAtom = atom((get) => {
  const token = get(tokenAtom)
  return token ? decodeTokenExp(token) : null
})

export const logoutAtom = atom(null, (_get, set) => {
  set(tokenAtom, null)
  set(currentUserAtom, null)
})
