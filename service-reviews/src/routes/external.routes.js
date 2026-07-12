const express = require('express')
const { requireAuth } = require('../middleware/auth')
const Review = require('../models/Review')

const router = express.Router()

// GET /api/external/reviews?movieId=xxx
// Route pensée pour un utilisateur EXTERNE (pas le frontend) :
// - avec un JWT valide en header "Authorization: Bearer <token>" -> 200 + données
// - sans JWT / JWT invalide -> 401 "Access denied"
router.get('/reviews', requireAuth, async (req, res, next) => {
  try {
    const filter = req.query.movieId ? { movieId: req.query.movieId } : {}
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(50)
    res.json({
      requestedBy: req.user.email || req.user.sub,
      count: reviews.length,
      reviews,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
