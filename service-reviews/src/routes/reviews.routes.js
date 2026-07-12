const express = require('express')
const Review = require('../models/Review')

const router = express.Router()

// GET /movies/:movieId/reviews
router.get('/:movieId/reviews', async (req, res, next) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    next(err)
  }
})

// POST /movies/:movieId/reviews
// (backend-main a déjà vérifié le JWT côté gateway et transmet userId/userName)
router.post('/:movieId/reviews', async (req, res, next) => {
  try {
    const { rating, comment, userId, userName } = req.body

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note (rating) doit être un nombre entre 1 et 5.' })
    }
    if (!userId || !userName) {
      return res.status(400).json({ message: 'userId et userName sont requis.' })
    }

    const review = await Review.create({
      movieId: req.params.movieId,
      userId,
      userName,
      rating,
      comment: comment || '',
    })
    res.status(201).json(review)
  } catch (err) {
    next(err)
  }
})

// PUT /movies/:movieId/reviews/:reviewId (exigence CRUD complète de la roadmap)
router.put('/:movieId/reviews/:reviewId', async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const updated = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, movieId: req.params.movieId },
      { ...(rating && { rating }), ...(comment !== undefined && { comment }) },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Avis introuvable.' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /movies/:movieId/reviews/:reviewId
router.delete('/:movieId/reviews/:reviewId', async (req, res, next) => {
  try {
    const deleted = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      movieId: req.params.movieId,
    })
    if (!deleted) return res.status(404).json({ message: 'Avis introuvable.' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
