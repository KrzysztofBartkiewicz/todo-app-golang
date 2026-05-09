import { Navigate, Outlet } from 'react-router'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../state/auth'

const RequireAuth = () => {
  const token = useAtomValue(tokenAtom)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth
