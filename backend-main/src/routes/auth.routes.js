const express = require('express')
const passport = require('passport')
const env = require('../config/env')
const { signUserToken } = require('../utils/jwt')

const router = express.Router()

router.get('/google', (req, res, next) => {
  const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : '/'
  const state = Buffer.from(JSON.stringify({ redirect })).toString('base64url')

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state,
  })(req, res, next)
})

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  (req, res) => {
    const token = signUserToken(req.user)

    let redirect = '/'
    try {
      const decodedState = JSON.parse(Buffer.from(req.query.state, 'base64url').toString('utf8'))
      redirect = decodedState.redirect || '/'
    } catch {
      redirect = '/'
    }

    const url = new URL('/auth/callback', env.frontendUrl)
    url.searchParams.set('token', token)
    url.searchParams.set('redirect', redirect)

    res.redirect(url.toString())
  }
)

router.get('/google/failure', (req, res) => {
  const url = new URL('/login', env.frontendUrl)
  res.redirect(url.toString())
})

module.exports = router