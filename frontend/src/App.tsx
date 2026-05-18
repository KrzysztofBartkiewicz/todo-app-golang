import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme/theme'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { appModeAtom } from './state/state'
import { logoutAtom } from './state/auth'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { setOnNetworkError, setOnUnauthorized } from './api'

function App() {
  const appMode = useAtomValue(appModeAtom)
  const logout = useSetAtom(logoutAtom)
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location.pathname)

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  useEffect(() => {
    locationRef.current = location.pathname
  }, [location.pathname])

  const handleUnauthorized = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  const handleNetworkError = useCallback(() => {
    if (locationRef.current === '/connection-error') return
    navigate('/connection-error', { replace: true })
  }, [navigate])

  useEffect(() => {
    setOnUnauthorized(handleUnauthorized)
    setOnNetworkError(handleNetworkError)
  }, [handleUnauthorized, handleNetworkError])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
