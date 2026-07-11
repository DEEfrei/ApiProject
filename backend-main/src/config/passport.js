const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const env = require('./env')

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || null,
        picture: profile.photos?.[0]?.value || null,
      }
      return done(null, user)
    }
  )
)

module.exports = passport