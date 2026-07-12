const jwt = require('jsonwebtoken')
const env = require('../config/env')

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentification requise (token manquant).' })
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret)
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' })
  }
}

module.exports = { requireAuth }
