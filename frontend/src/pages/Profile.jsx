import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api/movies'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'

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

  const displayName = profile?.name || tokenUser?.name
  const displayEmail = profile?.email || tokenUser?.email
  const picture = profile?.picture || tokenUser?.picture

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-marquee-light">Ta fiche</p>
      <h1 className="mt-1 font-display text-3xl tracking-wide text-cream">Mon profil</h1>

      {error && (
        <div className="mt-6">
          <ErrorBanner error={error} />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-muted">Chargement...</p>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-lg border border-cream/10 bg-surface p-5">
          {picture ? (
            <img src={picture} alt={displayName} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-velvet text-lg font-semibold text-cream">
              {displayName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-medium text-cream">{displayName || '—'}</p>
            <p className="text-sm text-muted">{displayEmail || '—'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
