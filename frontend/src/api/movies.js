import apiClient from './client'

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

export async function fetchSimilarMovies(movieId) {
  const { data } = await apiClient.get(`/api/movies/${movieId}/similar`)
  return data
}