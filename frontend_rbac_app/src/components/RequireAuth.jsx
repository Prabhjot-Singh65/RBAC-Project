
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ roles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />

  const role = user?.user?.role
  if (roles && !roles.includes(role)) return <Navigate to='/forbidden' replace />

  return <Outlet />
}
