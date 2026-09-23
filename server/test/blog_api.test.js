const mongoose = require('mongoose')
const Blog = require('../models/blog')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('root123', 10)

  // 1. Changed username from 'root' to 'blog_root' to isolate it from user_api.test.js
  const user = new User({
    username: 'blog_root',
    name: 'blog_root',
    passwordHash
  })
  const savedUser = await user.save()

  helper.initialBlogs.forEach((blog) => {
    blog.user = savedUser._id
  })

  await Blog.insertMany(helper.initialBlogs)
})

const login = async () => {
  // 2. Updated credentials to use the isolated username
  const user = {
    username: 'blog_root',
    password: 'root123',
  }

  const response = await api.post('/api/login').send(user)
  return response.body.token
}

describe('when there is initially some blogs saved', () => {
  test('return correct amount of blog post', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)

    assert.strictEqual('id' in response.body[0], true)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const token = await login()
    const newBlog = {
      title: 'Mastering Async/Await in JavaScript',
      author: 'Jane Doe',
      url: 'https://dev.to/janedoe/mastering-async-await',
      likes: 142,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('content-type', /application\/json/)

    const blogInDataBase = await helper.blogsInDb()
    assert.strictEqual(blogInDataBase.length, helper.initialBlogs.length + 1)
  })

  test('likes property defaults to 0 if missing from the request', async () => {
    const newBlog = {
      title: 'Mastering Async/Await in JavaScript',
      author: 'Jane Doe',
      url: 'https://dev.to/janedoe/mastering-async-await',
    }

    const token = await login()

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('content-type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Jane Doe',
    }

    const token = await login()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 401 if a token is not provided', async () => {
    const blog = {
      title: 'Learning Node.js',
      author: 'Kenedy',
      url: 'https://example.com/learning-nodejs',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsInDb = await helper.blogsInDb()
    const id = blogsInDb.map((blog) => blog.id)
    const token = await login()

    await api
      .delete(`/api/blogs/${id[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const inDB = await helper.blogsInDb()
    assert.strictEqual(inDB.length, helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('a blog post\'s likes can be updated', async () => {
    const blogsInDB = await helper.blogsInDb()
    const updated = { ...blogsInDB[0], likes: 12 }

    await api
      .put(`/api/blogs/${blogsInDB[0].id}`)
      .send(updated)
      .expect(200)

    const updatedBlogInDB = (await helper.blogsInDb()).find(
      (blog) => blog.id === blogsInDB[0].id
    )

    assert.strictEqual(updatedBlogInDB.likes, updated.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
