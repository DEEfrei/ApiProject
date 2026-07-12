require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const movies = [
  { title: 'Inception', synopsis: 'Un voleur s\'infiltre dans les rêves pour voler des secrets.', posterUrl: 'https://placehold.co/300x450?text=Inception', genre: 'Sci-Fi', releaseYear: 2010 },
  { title: 'Interstellar', synopsis: 'Une équipe explore un trou de ver pour sauver l\'humanité.', posterUrl: 'https://placehold.co/300x450?text=Interstellar', genre: 'Sci-Fi', releaseYear: 2014 },
  { title: 'The Dark Knight', synopsis: 'Batman affronte le Joker à Gotham.', posterUrl: 'https://placehold.co/300x450?text=Dark+Knight', genre: 'Action', releaseYear: 2008 },
  { title: 'La La Land', synopsis: 'Une histoire d\'amour entre un musicien et une actrice.', posterUrl: 'https://placehold.co/300x450?text=La+La+Land', genre: 'Romance', releaseYear: 2016 },
  { title: 'Parasite', synopsis: 'Une famille pauvre s\'infiltre chez une famille riche.', posterUrl: 'https://placehold.co/300x450?text=Parasite', genre: 'Thriller', releaseYear: 2019 },
]

async function main() {
  for (const movie of movies) {
    await prisma.movie.create({ data: movie })
  }
  console.log(`Seed terminé : ${movies.length} films ajoutés.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
  