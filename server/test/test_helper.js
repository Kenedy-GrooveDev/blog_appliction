const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'Understanding JavaScript Closures',
    author: 'Jane Doe',
    url: 'https://example.com',
    likes: 142,
  },
  {
    title: 'A Guide to Modern CSS Layouts',
    author: 'John Smith',
    url: 'https://example.com',
    likes: 89,
  },
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const dummyBlog = new Blog({
    title: 'A Guide to Modern CSS Layouts',
    author: 'John Smith',
    url: 'https://example.com',
  })
  await dummyBlog.save()
  await Blog.deleteOne()
  return dummyBlog._id.toString()
}



module.exports = { initialBlogs, blogsInDb, nonExistingId }