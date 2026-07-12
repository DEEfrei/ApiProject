const mongoose = require('mongoose')
const env = require('./env')

async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri)
    console.log('[service-reviews] connecté à MongoDB')
  } catch (err) {
    console.error('[service-reviews] erreur connexion MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
