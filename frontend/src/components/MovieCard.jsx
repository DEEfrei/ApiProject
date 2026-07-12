import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-surface shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:shadow-velvet/30"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink-light">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Pas d&apos;affiche
          </div>
        )}

        {movie.averageRating != null && (
          <div className="ticket-badge absolute right-2 top-2 px-2.5 py-1 text-xs font-bold">
            ★ {movie.averageRating.toFixed(1)}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent px-3 pb-3 pt-10">
          <h3 className="font-display text-lg leading-tight tracking-wide text-cream">
            {movie.title}
          </h3>
          {movie.genre && (
            <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">{movie.genre}</p>
          )}
        </div>
      </div>
    </Link>
  )
}