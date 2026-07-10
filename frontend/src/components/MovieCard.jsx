import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[2/3] w-full bg-slate-100">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Pas d&apos;affiche
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate font-medium text-slate-900">{movie.title}</h3>
        {movie.averageRating != null && (
          <p className="text-sm text-slate-500">⭐ {movie.averageRating.toFixed(1)} / 5</p>
        )}
      </div>
    </Link>
  )
}
