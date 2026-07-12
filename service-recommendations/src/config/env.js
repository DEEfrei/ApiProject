require('dotenv').config()

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    console.warn(`[env] Variable manquante: ${name}`)
  }
  return value
}

module.exports = {
  port: Number(required('PORT', 4002)),
  nodeEnv: required('NODE_ENV', 'development'),
}
