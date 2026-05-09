import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme/theme'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { appModeAtom } from './state/state'
import { Outlet } from 'react-router'

function App() {
  const appMode = useAtomValue(appModeAtom)

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
