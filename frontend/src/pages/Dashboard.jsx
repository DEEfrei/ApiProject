import { useEffect, useMemo, useState } from 'react'
import { fetchMovies } from '../api/movies'
import MovieCard from '../components/MovieCard'
import ErrorBanner from '../components/ErrorBanner'

export default function Dashboard() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('Tous')

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

  const genres = useMemo(() => {
    const set = new Set(movies.map((m) => m.genre).filter(Boolean))
    return ['Tous', ...Array.from(set).sort()]
  }, [movies])

  const filtered = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase())
      const matchesGenre = activeGenre === 'Tous' || movie.genre === activeGenre
      return matchesSearch && matchesGenre
    })
  }, [movies, search, activeGenre])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-marquee-light">Séance en cours</p>
        <h1 className="font-display text-4xl tracking-wide text-cream sm:text-5xl">
          Le catalogue
        </h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chercher un film..."
          className="w-full rounded-full border border-cream/10 bg-surface px-4 py-2 text-sm text-cream placeholder:text-muted focus:border-marquee/50 focus:outline-none sm:w-72"
        />

        {genres.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition ${
                  activeGenre === genre
                    ? 'border-marquee bg-marquee text-ink'
                    : 'border-cream/10 text-muted hover:border-marquee/40 hover:text-cream'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner error={error} />
        </div>
      )}

      {loading ? (
        <p className="text-muted">Chargement des films...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted">
          Aucun film ne correspond à ta recherche. Essaie un autre titre ou genre.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}