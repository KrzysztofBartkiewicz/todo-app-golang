import { Box, Button, IconButton, SvgIcon, Typography } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { appModeAtom } from '../state/state'
import { useAtom, useAtomValue } from 'jotai'
import { useAuth } from '../auth/AuthProvider'
import { userNameAtom } from '../state/user'

const AppModeButton = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)
  const { logout } = useAuth()
  const userName = useAtomValue(userNameAtom)

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
        <IconButton onClick={() => setAppMode((prev) => (prev === 'light' ? 'dark' : 'light'))}>
          <SvgIcon fontSize="large">
            {appMode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </SvgIcon>
        </IconButton>
        <Button onClick={logout}>Logout</Button>
      </Box>
    </Box>
  )
}

export default AppModeButton
