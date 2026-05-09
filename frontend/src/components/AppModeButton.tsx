import { Box, Button, IconButton, SvgIcon, Typography } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { appModeAtom } from '../state/state'
import { logoutAtom, userNameAtom } from '../state/auth'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

const AppModeButton = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const userName = useAtomValue(userNameAtom)
  const logout = useSetAtom(logoutAtom)

  const isDark = appMode === 'dark'

  return (
    <Box
      sx={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {userName}
      </Typography>
      <Box>
        <IconButton
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setAppMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
        >
          <SvgIcon fontSize="large">
            {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </SvgIcon>
        </IconButton>
        <Button onClick={logout}>Logout</Button>
      </Box>
    </Box>
  )
}

export default AppModeButton
