const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)

})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  response.json(blog)
})



blogRouter.post('/', userExtractor,async (request, response) => {
  const user = request.user

  const { title, author, url, likes } = request.body

  const newBlog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  const blog = await newBlog.save()

  user.blogs = user.blogs.concat(blog._id)

  await blog.populate('user')

  await user.save()

  response.status(201).json(blog)
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)

  blog.likes = body.likes

  await blog.save()
  response.json(blog)

})

blogRouter.delete(
  '/:id',
  userExtractor
  ,
  async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({
        error: 'blog not found',
      })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: 'user not authorized to delete this blog',
      })
    }

    await blog.deleteOne()
    response.status(204).end()
  },
)
module.exports = blogRouter