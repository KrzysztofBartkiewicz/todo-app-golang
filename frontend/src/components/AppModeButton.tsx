import { Box, IconButton, SvgIcon } from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { appModeAtom } from '../state/state'
import { useAtom } from 'jotai'

const AppModeButton = () => {
  const [appMode, setAppMode] = useAtom(appModeAtom)

  return (
    <Box
      sx={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <IconButton onClick={() => setAppMode((prev) => (prev === 'light' ? 'dark' : 'light'))}>
        <SvgIcon fontSize="large">
          {appMode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </SvgIcon>
      </IconButton>
    </Box>
  )
}

export default AppModeButton
