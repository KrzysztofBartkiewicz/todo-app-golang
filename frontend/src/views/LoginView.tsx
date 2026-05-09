import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { login, register } from '../api'
import { useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'
import { userNameAtom } from '../state/user'
import { useAuth } from '../auth/AuthProvider'

const LoginView = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUserName = useSetAtom(userNameAtom)
  const { login: setAuthToken } = useAuth()

  return (
    <Box
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
          variant="outlined"
          sx={{ mb: 2 }}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={async () => {
            try {
              const data = await login(username, password)
              setAuthToken(data.token)
              setUserName(username)
              navigate('/')
            } catch (error) {
              console.error('Login failed:', error)
            }
          }}
        >
          Login
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, '&:hover': { backgroundColor: 'transparent' } }}
          onClick={async () => {
            try {
              const data = await register(username, password)
              console.log('Registration successful:', data)
            } catch (error) {
              console.error('Registration failed:', error)
            }
          }}
        >
          Register
        </Button>
      </Box>
    </Box>
  )
}

export default LoginView
