const axios = require('axios')
const env = require('../config/env')

const reviewsApi = axios.create({
  baseURL: env.services.reviewsUrl,
  timeout: 5000,
})

async function getReviewsForMovie(movieId) {
  const { data } = await reviewsApi.get(`/movies/${movieId}/reviews`)
  return data
}

async function createReview(movieId, { rating, comment }, user) {
  const { data } = await reviewsApi.post(`/movies/${movieId}/reviews`, {
    rating,
    comment,
    userId: user.sub,
    userName: user.name,
  })
  return data
}

async function getAverageRating(movieId) {
  try {
    const reviews = await getReviewsForMovie(movieId)
    if (!Array.isArray(reviews) || reviews.length === 0) return null
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    return Number((sum / reviews.length).toFixed(1))
  } catch {
    return null
  }
}

module.exports = { getReviewsForMovie, createReview, getAverageRating }