const Blog = require('../models/blog')
const User = require('../models/user')
const router = require('express').Router()

router.post('/reset', async (request, response) => {
  try {
    await User.collection.dropIndexes()
  } catch {
    // Ignore if there are no indexes
  }

  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(204).end()
})

module.exports = router
