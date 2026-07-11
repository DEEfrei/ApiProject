import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchMovieById, fetchReviews, submitReview } from '../api/movies'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'

export default function MovieDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchMovieById(id), fetchReviews(id)])
      .then(([movieData, reviewsData]) => {
        if (!cancelled) {
          setMovie(movieData)
          setReviews(reviewsData)
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
    return <p className="mx-auto max-w-3xl px-4 py-8 text-slate-500">Chargement...</p>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ErrorBanner error={error} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        &larr; Retour au catalogue
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{movie?.title}</h1>
      {movie?.synopsis && <p className="mt-2 text-slate-600">{movie.synopsis}</p>}

      <section className="mt-8">
        <h2 className="text-lg font-medium text-slate-900">Avis</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="rating" className="text-sm text-slate-600">
                Note
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
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
              placeholder="Votre avis..."
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={3}
            />
            {submitError && <ErrorBanner error={submitError} />}
            <button
              type="submit"
              disabled={submitting}
              className="w-fit rounded-md bg-slate-900 px-4 py-1.5 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {submitting ? 'Envoi...' : 'Publier mon avis'}
            </button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            <Link to="/login" className="underline">
              Connectez-vous
            </Link>{' '}
            pour laisser un avis.
          </p>
        )}

        <ul className="mt-6 flex flex-col gap-3">
          {reviews.length === 0 && (
            <li className="text-sm text-slate-500">Aucun avis pour ce film pour le moment.</li>
          )}
          {reviews.map((review) => (
            <li key={review.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <span className="font-medium">⭐ {review.rating}/5</span>
              {review.comment && <p className="mt-1 text-slate-600">{review.comment}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
