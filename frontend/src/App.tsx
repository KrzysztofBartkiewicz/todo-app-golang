import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme/theme'
import { useCallback, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { appModeAtom } from './state/state'
import { logoutAtom, tokenExpMsAtom } from './state/auth'
import { Outlet, useNavigate } from 'react-router'
import { setOnUnauthorized } from './api'

function App() {
  const appMode = useAtomValue(appModeAtom)
  const tokenExpMs = useAtomValue(tokenExpMsAtom)
  const logout = useSetAtom(logoutAtom)
  const navigate = useNavigate()

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  const handleExpired = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  useEffect(() => {
    setOnUnauthorized(handleExpired)
  }, [handleExpired])

  useEffect(() => {
    if (!tokenExpMs) return
    const remaining = tokenExpMs - Date.now()
    if (remaining <= 0) {
      handleExpired()
      return
    }
    const timer = setTimeout(handleExpired, remaining)
    return () => clearTimeout(timer)
  }, [tokenExpMs, handleExpired])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
