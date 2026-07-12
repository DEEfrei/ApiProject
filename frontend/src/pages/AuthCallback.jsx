import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Route montée sur /auth/callback (à déclarer aussi côté backend comme
// FRONTEND_URL/auth/callback dans la config OAuth Google).
export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect') || '/'

    if (!token) {
      setError("Aucun token reçu du serveur d'authentification.")
      return
    }

    try {
      login(token)
      navigate(redirect, { replace: true })
    } catch {
      setError('Le token reçu est invalide ou expiré.')
    }
  }, [searchParams, login, navigate])

  if (error) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-sm text-slate-600 underline"
        >
          Retour à la connexion
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24 text-center text-slate-500">
      Connexion en cours...
    </div>
  )
}
