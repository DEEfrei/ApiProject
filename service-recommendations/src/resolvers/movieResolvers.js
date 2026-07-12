const prisma = require('../db/prisma')

const resolvers = {
  Query: {
    movies: async (_, { search }) => {
      if (!search) {
        return prisma.movie.findMany({ orderBy: { id: 'asc' } })
      }
      return prisma.movie.findMany({
        where: { title: { contains: search, mode: 'insensitive' } },
        orderBy: { id: 'asc' },
      })
    },
    movie: async (_, { id }) => {
      return prisma.movie.findUnique({ where: { id: Number(id) } })
    },
    similarMovies: async (_, { movieId }) => {
      const movie = await prisma.movie.findUnique({ where: { id: Number(movieId) } })
      if (!movie || !movie.genre) return []
      return prisma.movie.findMany({
        where: { genre: movie.genre, id: { not: movie.id } },
        take: 5,
      })
    },
  },
  Mutation: {
    createMovie: async (_, args) => {
      return prisma.movie.create({ data: args })
    },
  },
}

module.exports = resolvers
