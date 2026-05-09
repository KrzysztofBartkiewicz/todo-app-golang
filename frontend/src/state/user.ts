import { atomWithReset } from 'jotai/utils'

export const userNameAtom = atomWithReset<string | null>(null)
