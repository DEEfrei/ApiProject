import { useEffect, useState } from 'react'
import { fetchMovies } from '../api/movies'
import MovieCard from '../components/MovieCard'
import ErrorBanner from '../components/ErrorBanner'

// Page d'accueil : liste des films, publique (pas besoin d'être connecté pour
// parcourir le catalogue - seule la notation/les avis exigent une connexion).
export default function Dashboard() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMovies()
      .then((data) => {
        if (!cancelled) setMovies(data)
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Catalogue de films</h1>

      {error && <div className="mb-4"><ErrorBanner error={error} /></div>}

      {loading ? (
        <p className="text-slate-500">Chargement des films...</p>
      ) : movies.length === 0 ? (
        <p className="text-slate-500">
          Aucun film disponible pour le moment (vérifiez que backend-main et
          service-recommendations tournent).
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
