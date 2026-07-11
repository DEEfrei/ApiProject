const express = require('express')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/', requireAuth, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  })
})

module.exports = router