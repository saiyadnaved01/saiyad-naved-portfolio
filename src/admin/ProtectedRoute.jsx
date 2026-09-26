import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading…</div>
  }
  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return children
}
