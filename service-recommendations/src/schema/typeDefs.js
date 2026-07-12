const typeDefs = `#graphql
  type Movie {
    id: ID!
    title: String!
    synopsis: String
    posterUrl: String
    genre: String
    releaseYear: Int
  }

  type Query {
    movies(search: String): [Movie!]!
    movie(id: ID!): Movie
    similarMovies(movieId: ID!): [Movie!]!
  }

  type Mutation {
    createMovie(
      title: String!
      synopsis: String
      posterUrl: String
      genre: String
      releaseYear: Int
    ): Movie!
  }
`

module.exports = typeDefs
