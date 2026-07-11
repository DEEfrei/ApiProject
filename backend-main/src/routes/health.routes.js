const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'backend-main' })
})

module.exports = router