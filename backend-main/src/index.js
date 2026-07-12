const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const env = require('./config/env')
const passport = require('./config/passport')

const healthRoutes = require('./routes/health.routes')
const authRoutes = require('./routes/auth.routes')
const moviesRoutes = require('./routes/movies.routes')
const meRoutes = require('./routes/me.routes')

const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
)
app.use(express.json())
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use(passport.initialize())

app.use('/health', healthRoutes)
app.use('/auth', authRoutes)
app.use('/api/movies', moviesRoutes)
app.use('/api/me', meRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`[backend-main] écoute sur http://localhost:${env.port}`)
  console.log(`[backend-main] frontend attendu sur ${env.frontendUrl}`)
})