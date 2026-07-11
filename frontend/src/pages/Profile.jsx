import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api/movies'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'

// Page protégée (voir PrivateRoute) : accessible uniquement si connecté.
export default function Profile() {
  const { user: tokenUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchCurrentUser()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Mon profil</h1>

      {error && <ErrorBanner error={error} />}

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p>
            <span className="font-medium">Nom : </span>
            {profile?.name || tokenUser?.name || '—'}
          </p>
          <p>
            <span className="font-medium">Email : </span>
            {profile?.email || tokenUser?.email || '—'}
          </p>
        </div>
      )}
    </div>
  )
}
