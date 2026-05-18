import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import { Link as RouterLink, useNavigate } from 'react-router'

const ACCENT = '#EF4444'

const ConnectionErrorView = () => {
  const navigate = useNavigate()

  const tryAgain = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
        backgroundImage: `radial-gradient(circle at 15% 20%, ${ACCENT}22, transparent 55%), radial-gradient(circle at 85% 80%, ${ACCENT}1A, transparent 50%)`,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          borderTop: `4px solid ${ACCENT}`,
        }}
      >
        <Stack spacing={3}>
          <Stack alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: ACCENT, width: 48, height: 48 }}>
              <CloudOffOutlinedIcon />
            </Avatar>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600}>
                Can't reach the server
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                We're having trouble connecting. Check your internet connection
                or try again in a moment.
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1.25}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={tryAgain}
            >
              Try again
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                color: ACCENT,
                borderColor: ACCENT,
                backgroundColor: 'transparent',
                '&:hover': {
                  borderColor: ACCENT,
                  backgroundColor: `${ACCENT}14`,
                },
              }}
            >
              Back to sign in
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ConnectionErrorView
