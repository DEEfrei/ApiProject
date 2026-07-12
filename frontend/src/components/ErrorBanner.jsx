export default function ErrorBanner({ error }) {
  if (!error) return null

  const status = error.response?.status
  const message =
    status === 401 || status === 403
      ? 'Accès refusé : vous devez être connecté pour effectuer cette action.'
      : error.response?.data?.message || error.message || 'Une erreur est survenue.'

  return (
    <div className="rounded-md border border-velvet/40 bg-velvet/10 px-4 py-3 text-sm text-velvet-light">
      {message}
    </div>
  )
}