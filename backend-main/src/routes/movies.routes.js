const express = require('express')
const { requireAuth } = require('../middleware/auth')
const recommendations = require('../services/recommendationsClient')
const reviews = require('../services/reviewsClient')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const movies = await recommendations.listMovies({ search: req.query.search })

    const withRatings = await Promise.all(
      movies.map(async (movie) => ({
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        averageRating: await reviews.getAverageRating(movie.id),
      }))
    )

    res.json(withRatings)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await recommendations.getMovieById(req.params.id)
    if (!movie) {
      return res.status(404).json({ message: 'Film introuvable.' })
    }
    res.json(movie)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/reviews', async (req, res, next) => {
  try {
    const data = await reviews.getReviewsForMovie(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note (rating) doit être un nombre entre 1 et 5.' })
    }

    const created = await reviews.createReview(req.params.id, { rating, comment }, req.user)
    res.status(201).json(created)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/similar', async (req, res, next) => {
  try {
    const similar = await recommendations.getSimilarMovies(req.params.id)
    res.json(similar)
  } catch (err) {
    next(err)
  }
})

module.exports = router