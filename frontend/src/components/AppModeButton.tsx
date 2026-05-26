import { Box, IconButton, SvgIcon } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { appModeAtom } from '../state/state'
import { useAtom } from 'jotai'
import Sidebar from './Sidebar'
import { useState } from 'react'

const AppModeButton = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDark = appMode === 'dark'

  return (
    <>
      <Box
        sx={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={() => setSidebarOpen(true)}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <IconButton
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setAppMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
        >
          <SvgIcon fontSize="large">
            {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </SvgIcon>
        </IconButton>
      </Box>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default AppModeButton
