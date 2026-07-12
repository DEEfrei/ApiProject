const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')

const env = require('./config/env')
const typeDefs = require('./schema/typeDefs')
const resolvers = require('./resolvers/movieResolvers')

async function start() {
  const app = express()
  app.use(cors())

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'service-recommendations' })
  })

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()

  app.use('/graphql', bodyParser.json(), expressMiddleware(server))

  app.listen(env.port, () => {
    console.log(`[service-recommendations] écoute sur http://localhost:${env.port}/graphql`)
  })
}

start()
