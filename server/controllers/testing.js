const Blog = require('../models/blog')
const User = require('../models/user')
const router = require('express').Router()

router.post('/reset', async (request, response) => {
  // 🌟 Force MongoDB to completely drop its cached unique index locks
  try {
    await User.collection.dropIndexes()
  } catch (error) {
    // It's safe to ignore an error here if the collection was completely empty
  }

  // Clear out the collections completely as normal
  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(204).end()
})

module.exports = router
