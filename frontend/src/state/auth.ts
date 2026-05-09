import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const tokenAtom = atomWithStorage<string | null>('token', null, undefined, {
  getOnInit: true,
})

const decodeToken = (token: string): { expMs: number | null; username: string | null } => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      expMs: typeof payload.exp === 'number' ? payload.exp * 1000 : null,
      username: typeof payload.username === 'string' ? payload.username : null,
    }
  } catch {
    return { expMs: null, username: null }
  }
}

export const userNameAtom = atom((get) => {
  const token = get(tokenAtom)
  return token ? decodeToken(token).username : null
})

export const tokenExpMsAtom = atom((get) => {
  const token = get(tokenAtom)
  return token ? decodeToken(token).expMs : null
})

export const logoutAtom = atom(null, (_get, set) => {
  set(tokenAtom, null)
})
