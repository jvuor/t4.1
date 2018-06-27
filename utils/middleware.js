const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' && process.env.NODE_LOGGING !== 'true') {
    return next()
  }
    console.log('Method:', request.method, 'Path:', request.path, 'Body:', request.body)
    next()
}
  
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  error
}