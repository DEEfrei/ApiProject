require('dotenv').config()
const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// Titres qu'on veut dans le catalogue (mêmes films qu'avant, mais avec les vraies données TMDB)
const MOVIE_TITLES = [
  'Inception',
  'Interstellar',
  'The Dark Knight',
  'La La Land',
  'Parasite',
  'Mad Max: Fury Road',
  'Dune',
  'Blade Runner 2049',
  'The Shawshank Redemption',
  'Forrest Gump',
  'Se7en',
  'Gone Girl',
  'Spirited Away',
  'Coco',
  'The Grand Budapest Hotel',
]

async function fetchMovieFromTmdb(title) {
  const { data } = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query: title,
      language: 'fr-FR',
    },
  })

  const result = data.results?.[0]
  if (!result) {
    console.warn(`Aucun résultat TMDB pour "${title}"`)
    return null
  }

  // Récupère les genres via l'endpoint détail (search ne renvoie que des genre_ids)
  const { data: details } = await axios.get(`${TMDB_BASE_URL}/movie/${result.id}`, {
    params: { api_key: TMDB_API_KEY, language: 'fr-FR' },
  })

  return {
    tmdbId: result.id,
    title: result.title,
    synopsis: result.overview || null,
    posterUrl: result.poster_path ? `${TMDB_IMAGE_BASE}${result.poster_path}` : null,
    genre: details.genres?.[0]?.name || null,
    releaseYear: result.release_date ? Number(result.release_date.slice(0, 4)) : null,
  }
}

async function main() {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY manquant dans .env')
  }

  for (const title of MOVIE_TITLES) {
    const movieData = await fetchMovieFromTmdb(title)
    if (!movieData) continue

    await prisma.movie.upsert({
      where: { tmdbId: movieData.tmdbId },
      update: movieData,
      create: movieData,
    })

    console.log(`✔ ${movieData.title} (${movieData.releaseYear}) ajouté/mis à jour`)
  }

  console.log('Seed TMDB terminé.')
}

main()
  .catch((e) => {
    console.error(e.response?.data || e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
