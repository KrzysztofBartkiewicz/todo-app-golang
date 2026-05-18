import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { useState } from 'react'
import { NetworkError, register } from '../api'
import { Link as RouterLink, useNavigate } from 'react-router'

const ACCENT = '#10B981'

const RegisterView = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const submitRegister = async () => {
    setBusy(true)
    setError(null)
    try {
      await register(username, password)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (e) {
      if (e instanceof NetworkError) return
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setBusy(false)
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
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            submitRegister()
          }}
        >
          <Stack spacing={3}>
            <Stack alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: ACCENT, width: 48, height: 48 }}>
                <PersonAddOutlinedIcon />
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600}>
                  Create your account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Start organizing your tasks in seconds.
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Username"
                autoComplete="username"
                autoFocus
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={busy || !username || !password}
            >
              Create account
            </Button>

            <Divider flexItem />

            <Stack alignItems="center" spacing={1.25}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
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
                Sign in instead
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RegisterView
