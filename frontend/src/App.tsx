import { CssBaseline, ThemeProvider } from '@mui/material'
import MainView from './views/MainView'
import { createAppTheme } from './theme/theme'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { appModeAtom } from './state/state'

function App() {
  const appMode = useAtomValue(appModeAtom)

  const theme = useMemo(() => createAppTheme(appMode), [appMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainView />
    </ThemeProvider>
  )
}

export default App
