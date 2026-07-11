function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route inconnue: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message)

  if (err.isAxiosError) {
    const status = err.response?.status || 502
    const message =
      err.response?.data?.message || `Le service distant a renvoyé une erreur (${status}).`
    return res.status(status).json({ message })
  }

  const status = err.status || 500
  const message = err.message || 'Erreur interne du serveur.'
  res.status(status).json({ message })
}

module.exports = { notFoundHandler, errorHandler }