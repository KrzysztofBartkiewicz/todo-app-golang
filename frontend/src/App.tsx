import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme/theme'
import { useEffect, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { appModeAtom } from './state/state'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from './auth/AuthProvider'

function App() {
  const appMode = useAtomValue(appModeAtom)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  useEffect(() => {
    const handler = () => {
      logout()
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:expired', handler)
    return () => window.removeEventListener('auth:expired', handler)
  }, [logout, navigate])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
