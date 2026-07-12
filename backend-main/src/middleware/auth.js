const { verifyToken } = require('../utils/jwt')

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentification requise (token manquant).' })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' })
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme === 'Bearer' && token) {
    try {
      req.user = verifyToken(token)
    } catch {
      req.user = null
    }
  }
  next()
}

module.exports = { requireAuth, optionalAuth }