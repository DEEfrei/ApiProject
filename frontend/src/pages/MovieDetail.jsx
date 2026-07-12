import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchMovieById, fetchReviews, submitReview, fetchSimilarMovies } from '../api/movies'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import MovieCard from '../components/MovieCard'

export default function MovieDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      fetchMovieById(id),
      fetchReviews(id),
      fetchSimilarMovies(id).catch(() => []), // section bonus, ne bloque pas la page si ça échoue
    ])
      .then(([movieData, reviewsData, similarData]) => {
        if (!cancelled) {
          setMovie(movieData)
          setReviews(reviewsData)
          setSimilar(similarData)
        }
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
  }, [id])

  async function handleSubmitReview(event) {
    event.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const newReview = await submitReview(id, { rating: Number(rating), comment })
      setReviews((prev) => [newReview, ...prev])
      setComment('')
    } catch (err) {
      setSubmitError(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-4xl px-4 py-16 text-center text-muted">Chargement...</p>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorBanner error={error} />
      </div>
    )
  }

  return (
    <div>
      {/* Bandeau immersif */}
      <div className="relative overflow-hidden border-b border-cream/10">
        {movie?.posterUrl && (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-md"
            style={{ backgroundImage: `url(${movie.posterUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:px-6 sm:py-14">
          <Link
            to="/"
            className="absolute left-4 top-4 text-xs text-muted transition hover:text-cream sm:left-6 sm:top-6"
          >
            &larr; Retour au catalogue
          </Link>

          {movie?.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="mx-auto w-40 flex-shrink-0 rounded-lg shadow-2xl shadow-black/60 sm:mx-0 sm:w-56"
            />
          )}

          <div className="mt-8 flex flex-col justify-end sm:mt-0">
            {movie?.genre && (
              <p className="text-xs uppercase tracking-[0.3em] text-marquee-light">
                {movie.genre} {movie?.releaseYear && `· ${movie.releaseYear}`}
              </p>
            )}
            <h1 className="mt-2 font-display text-4xl tracking-wide text-cream sm:text-5xl">
              {movie?.title}
            </h1>
            {movie?.synopsis && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{movie.synopsis}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Avis */}
        <section>
          <h2 className="font-display text-2xl tracking-wide text-cream">Avis</h2>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <label htmlFor="rating" className="text-sm text-muted">
                  Ta note
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="rounded-md border border-cream/10 bg-surface px-2 py-1 text-sm text-cream focus:border-marquee/50 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value} / 5
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qu'as-tu pensé de ce film ?"
                className="rounded-md border border-cream/10 bg-surface px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-marquee/50 focus:outline-none"
                rows={3}
              />
              {submitError && <ErrorBanner error={submitError} />}
              <button
                type="submit"
                disabled={submitting}
                className="w-fit rounded-full bg-marquee px-5 py-2 text-sm font-semibold text-ink transition hover:bg-marquee-light disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : 'Publier mon avis'}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-muted">
              <Link to="/login" className="text-marquee-light underline">
                Connecte-toi
              </Link>{' '}
              pour laisser un avis.
            </p>
          )}

          <ul className="mt-8 flex flex-col gap-3">
            {reviews.length === 0 && (
              <li className="text-sm text-muted">Aucun avis pour ce film pour le moment. Sois le premier.</li>
            )}
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg border border-cream/10 bg-surface p-4 text-sm"
              >
                <span className="ticket-badge inline-block px-2 py-0.5 text-xs font-bold">
                  ★ {review.rating}/5
                </span>
                {review.userName && (
                  <span className="ml-2 text-xs text-muted">{review.userName}</span>
                )}
                {review.comment && <p className="mt-2 text-muted">{review.comment}</p>}
              </li>
            ))}
          </ul>
        </section>

        {/* Films similaires - moteur de recommandation */}
        {similar.length > 0 && (
          <section className="mt-14">
            <p className="text-xs uppercase tracking-[0.3em] text-marquee-light">
              Parce que tu regardes ceci
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-wide text-cream">
              Films similaires
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
