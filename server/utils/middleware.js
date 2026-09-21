const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndPoint = (request, response) => {
  return response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformated ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.code === 11000) {
    response.status(400).json({ error: 'username exists' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next()
}

const validatePassword = (request, response, next) => {
  const { password } = request.body

  if (!password) {
    return response.status(400).json({
      error: 'Password is required',
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long',
    })
  }

  next()
}

const hashPassword = async (request, response, next) => {
  try {
    const saltRounds = 10

    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

    request.body.passwordHash = passwordHash
    delete request.body.password

    next()
  } catch (error) {
    next(error)
  }
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'user not found',
      })
    }

    request.user = user
    console.log(request.user)
  } catch (error) {
    return next(error)
  }
  next()
}

module.exports = {
  unknownEndPoint,
  errorHandler,
  hashPassword,
  validatePassword,
  tokenExtractor,
  userExtractor,
}
