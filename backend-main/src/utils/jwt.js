const jwt = require('jsonwebtoken')
const env = require('../config/env')

function signUserToken(user) {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture || null,
  }
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn })
}

function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret)
}

module.exports = { signUserToken, verifyToken }