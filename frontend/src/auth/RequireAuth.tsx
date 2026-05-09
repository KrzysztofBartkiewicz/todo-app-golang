import { Navigate, Outlet } from 'react-router'
import { useAuth } from './AuthProvider'

const RequireAuth = () => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth
