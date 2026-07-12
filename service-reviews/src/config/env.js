require('dotenv').config()

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    console.warn(`[env] Variable manquante: ${name}`)
  }
  return value
}

module.exports = {
  port: Number(required('PORT', 4001)),
  nodeEnv: required('NODE_ENV', 'development'),
  mongoUri: required('MONGO_URI', 'mongodb://localhost:27017/cinematch_reviews'),
  jwt: {
    secret: required('JWT_SECRET'),
  },
}
