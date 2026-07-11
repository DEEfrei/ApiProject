// Affichage propre des erreurs API (401/403/500...) exigé par le PSF
// ("gestion d'erreurs pour les requêtes non authentifiées").
export default function ErrorBanner({ error }) {
  if (!error) return null

  const status = error.response?.status
  const message =
    status === 401 || status === 403
      ? "Accès refusé : vous devez être connecté pour effectuer cette action."
      : error.response?.data?.message || error.message || 'Une erreur est survenue.'

  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}
