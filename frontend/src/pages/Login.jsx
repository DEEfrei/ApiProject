import { useLocation } from 'react-router-dom'
import { API_URL } from '../api/client'

// Flux d'authentification (voir roadmap Phase 5) :
// 1. Ce bouton redirige le navigateur vers backend-main: GET /auth/google
// 2. backend-main (Passport.js) redirige vers Google, l'utilisateur se connecte
// 3. Google renvoie backend-main sur son callback OAuth
// 4. backend-main génère un JWT signé et redirige vers
//    FRONTEND_URL/auth/callback?token=<jwt>
// 5. La page AuthCallback (ci-contre) récupère ce token et termine la connexion.
export default function Login() {
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  function handleGoogleLogin() {
    const redirectAfterLogin = encodeURIComponent(from)
    window.location.href = `${API_URL}/auth/google?redirect=${redirectAfterLogin}`
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Connexion à CinéMatch</h1>
      <p className="text-sm text-slate-500">
        Connectez-vous avec votre compte Google pour noter des films et voir vos
        recommandations personnalisées.
      </p>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        Se connecter avec Google
      </button>
    </div>
  )
}
