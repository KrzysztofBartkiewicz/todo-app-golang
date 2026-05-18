import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { apiLogout, getMe } from '../api'
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

export const logoutAtom = atom(null, async (_get, set) => {
  set(tokenAtom, null)
  set(currentUserAtom, null)
  try {
    await apiLogout()
  } catch {
    // ignore — local state is already cleared
  }
})
