import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme/theme'
import { useCallback, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { appModeAtom } from './state/state'
import { logoutAtom } from './state/auth'
import { Outlet, useNavigate } from 'react-router'
import { setOnUnauthorized } from './api'

function App() {
  const appMode = useAtomValue(appModeAtom)
  const logout = useSetAtom(logoutAtom)
  const navigate = useNavigate()

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  const handleUnauthorized = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  useEffect(() => {
    setOnUnauthorized(handleUnauthorized)
  }, [handleUnauthorized])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
