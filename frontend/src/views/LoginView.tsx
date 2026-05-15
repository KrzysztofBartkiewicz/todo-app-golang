import { Alert, Box, Button, Snackbar, TextField } from '@mui/material'
import { useState } from 'react'
import { login, register } from '../api'
import { useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'
import { currentUserAtom, tokenAtom } from '../state/auth'

const LoginView = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const setToken = useSetAtom(tokenAtom)
  const setCurrentUser = useSetAtom(currentUserAtom)

  const submitLogin = async () => {
    setBusy(true)
    setError(null)
    try {
      const { token, user } = await login(username, password)
      setToken(token)
      setCurrentUser(user)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const submitRegister = async () => {
    setBusy(true)
    setError(null)
    try {
      await register(username, password)
      const { token, user } = await login(username, password)
      setToken(token)
      setCurrentUser(user)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        submitLogin()
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box>
        <TextField
          label="Username"
          sx={{ mb: 2 }}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" fullWidth disabled={busy}>
          Login
        </Button>
        <Button
          variant="text"
          fullWidth
          disabled={busy}
          sx={{ mt: 1, '&:hover': { backgroundColor: 'transparent' } }}
          onClick={submitRegister}
        >
          Register
        </Button>
      </Box>
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

export default LoginView
