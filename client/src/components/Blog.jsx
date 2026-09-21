import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, removeBlog, handleLike, loggedInUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const liking = async () => {
    await handleLike(blog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id)
        removeBlog(blog.id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div
      className="blog-container"
      style={{ border: '2px solid black', padding: '10px', margin: '10px 0' }}
    >
      <div className="blog-title">
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowDetails(prev => !prev)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div style={{ marginTop: '5px' }}>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
          <br />
          likes: {blog.likes} <button onClick={liking}>like</button>
          <br />
          {blog.user?.username || blog.user?.name || 'unknown'}
          <br />

          {blog.user?.username === loggedInUser && (
            <button
              style={{ backgroundColor: 'blue' }}
              onClick={handleDelete}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog