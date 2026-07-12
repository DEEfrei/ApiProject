const axios = require('axios')
const env = require('../config/env')

async function graphqlRequest(query, variables = {}) {
  const { data } = await axios.post(
    env.services.recommendationsUrl,
    { query, variables },
    { timeout: 5000 }
  )

  if (data.errors?.length) {
    const message = data.errors.map((e) => e.message).join(' | ')
    const err = new Error(message)
    err.status = 502
    throw err
  }

  return data.data
}

async function listMovies({ search } = {}) {
  const query = `
    query ListMovies($search: String) {
      movies(search: $search) {
        id
        title
        posterUrl
        genre
        releaseYear
      }
    }
  `
  const data = await graphqlRequest(query, { search: search || null })
  return data.movies
}

async function getMovieById(id) {
  const query = `
    query GetMovie($id: ID!) {
      movie(id: $id) {
        id
        title
        synopsis
        posterUrl
        genre
        releaseYear
      }
    }
  `
  const data = await graphqlRequest(query, { id })
  return data.movie
}

async function getSimilarMovies(id) {
  const query = `
    query SimilarMovies($movieId: ID!) {
      similarMovies(movieId: $movieId) {
        id
        title
        posterUrl
        genre
      }
    }
  `
  const data = await graphqlRequest(query, { movieId: id })
  return data.similarMovies
}

module.exports = { listMovies, getMovieById, getSimilarMovies }