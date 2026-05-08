import { atomWithStorage } from 'jotai/utils'
import type { AppMode } from '../interfaces/app'

export const appModeAtom = atomWithStorage<AppMode>(
  'appMode',
  'light',
  undefined,
  {
    getOnInit: true,
  }
)
