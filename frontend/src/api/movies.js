import apiClient from './client'

// --- Contrat API attendu côté backend-main (à aligner avec le membre backend) ---
// GET    /api/movies              -> liste des films (public)
// GET    /api/movies/:id          -> détail d'un film (public)
// GET    /api/movies/:id/reviews  -> avis liés à un film (proxy vers service-reviews)
// POST   /api/movies/:id/reviews  -> ajouter un avis (protégé, JWT requis)
// GET    /api/me                  -> profil de l'utilisateur connecté (protégé)
// ---------------------------------------------------------------------------

export async function fetchMovies(params = {}) {
  const { data } = await apiClient.get('/api/movies', { params })
  return data
}

export async function fetchMovieById(id) {
  const { data } = await apiClient.get(`/api/movies/${id}`)
  return data
}

export async function fetchReviews(movieId) {
  const { data } = await apiClient.get(`/api/movies/${movieId}/reviews`)
  return data
}

export async function submitReview(movieId, { rating, comment }) {
  const { data } = await apiClient.post(`/api/movies/${movieId}/reviews`, {
    rating,
    comment,
  })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/api/me')
  return data
}
