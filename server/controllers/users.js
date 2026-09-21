const userRouter = require('express').Router()

const User = require('../models/user')
const { hashPassword, validatePassword } = require('../utils/middleware')

userRouter.get('/', async (request, response) => {
  const results = await User.find({}).populate('blogs')

  response.json(results)
})

userRouter.post('/',validatePassword,hashPassword, async (request, response) => {
  const { username, name, passwordHash } = request.body

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter
