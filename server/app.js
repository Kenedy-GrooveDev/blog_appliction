const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const cors = require('cors')
const { unknownEndPoint, errorHandler, tokenExtractor } = require('./utils/middleware')

const dns = require('node:dns')
const healthRouter = require('./controllers/health')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express()

logger.info('connecting...')

mongoose.set('strictQuery', false)

const mongoUrl = config.MONGODB_URI
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUrl, { family: 4 })
    logger.info('Connected to DB successfully :)')
  } catch (error) {
    logger.error(`Initial DB connection failed: ${error.message}`)
  }
}

connectToDatabase()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173/',
  }),
)

app.use(express.static('dist'))

app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/health', healthRouter)

console.log('NODE_ENV:', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
