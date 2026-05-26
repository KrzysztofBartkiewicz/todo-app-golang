import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAtomValue, useSetAtom } from 'jotai'
import { logoutAtom, userNameAtom } from '../state/auth'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const username = useAtomValue(userNameAtom)
  const logout = useSetAtom(logoutAtom)

  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <IconButton onClick={onClose}>
          <MenuIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, pb: 2 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            fontSize: '2rem',
            bgcolor: '#38BDF8',
            mb: 1.5,
          }}
        >
          {username?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {username}
        </Typography>
      </Box>

      <Divider sx={{ mx: 3, my: 1 }} />

      <List sx={{ px: 1.5 }}>
        <ListItemButton selected>
          <ListItemIcon>
            <FormatListBulletedIcon />
          </ListItemIcon>
          <ListItemText primary="My Tasks" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider sx={{ mx: 1.5, mb: 1 }} />
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  )
}

export default Sidebar
