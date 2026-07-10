import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Exigence du PSF : "l'accès à certaines URLs doit être restreint aux utilisateurs
// connectés. Un accès non autorisé doit rediriger vers un écran approprié
// (ex. la page de login)."
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex justify-center py-16 text-slate-500">Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
