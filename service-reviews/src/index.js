const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const env = require('./config/env')
const connectDB = require('./config/db')

const healthRoutes = require('./routes/health.routes')
const reviewsRoutes = require('./routes/reviews.routes')
const externalRoutes = require('./routes/external.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.use('/health', healthRoutes)
app.use('/movies', reviewsRoutes)       // interne, appelé par backend-main
app.use('/api/external', externalRoutes) // API as a Service, démo Postman

app.use((req, res) => {
  res.status(404).json({ message: `Route inconnue: ${req.method} ${req.originalUrl}` })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err.message)
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur.' })
})

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`[service-reviews] écoute sur http://localhost:${env.port}`)
  })
})
