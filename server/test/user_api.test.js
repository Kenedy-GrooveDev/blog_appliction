const mongoose = require('mongoose')
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('root123', 10)

  const user = new User({
    username: 'root',
    name: 'root',
    passwordHash
  })

  await user.save()
})

test('invalid user is not created', async () => {

  const userAtStart = await User.find({})

  const invalidUser = {
    username: 'CC',
    name: 'chair',
    password:'1234567'
  }

  const results = await api
    .post('/api/users/')
    .send(invalidUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const userAtEnd = await User.find({})
  assert.strictEqual(
    results.body.error,
    'User validation failed: username: username is too short',
  )

  assert.strictEqual(userAtStart.length, userAtEnd.length)

  assert.strictEqual(
    userAtEnd.some((user) => user.username === 'CC'),
    false,
  )
})

after(async () => {
  await mongoose.connection.close()
})
