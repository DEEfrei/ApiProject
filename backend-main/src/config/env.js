require('dotenv').config()

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    console.warn(`[env] Variable manquante: ${name}`)
  }
  return value
}

module.exports = {
  port: Number(required('PORT', 4000)),
  nodeEnv: required('NODE_ENV', 'development'),
  frontendUrl: required('FRONTEND_URL', 'http://localhost:5173'),

  google: {
    clientId: required('GOOGLE_CLIENT_ID'),
    clientSecret: required('GOOGLE_CLIENT_SECRET'),
    callbackUrl: required('GOOGLE_CALLBACK_URL', 'http://localhost:4000/auth/google/callback'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: required('JWT_EXPIRES_IN', '7d'),
  },

  services: {
    reviewsUrl: required('SERVICE_REVIEWS_URL', 'http://localhost:4001'),
    recommendationsUrl: required('SERVICE_RECOMMENDATIONS_URL', 'http://localhost:4002/graphql'),
  },
}