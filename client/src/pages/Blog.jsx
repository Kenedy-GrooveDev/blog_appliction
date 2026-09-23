import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const Blog = ({ blogs, removeBlog, handleLike, loggedInUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <p style={{ padding: 15 }}>Loading blog data...</p>
  }

  const liking = async () => {
    if (!loggedInUser) return
    await handleLike(blog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id)
        removeBlog(blog.id)
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const isOwner = loggedInUser && (
    blog.user?.username === loggedInUser.username ||
    blog.user === loggedInUser.id ||
    blog.user?.id === loggedInUser.id
  )

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '1.5em', margin: '10px 0' }}>
        {blog.author}: {blog.title}
      </h2>

      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div style={{ margin: '5px 0' }}>
        likes {blog.likes} {loggedInUser && <button onClick={liking}>like</button>}
      </div>

      <div style={{ margin: '5px 0' }}>
        Added by {blog.user?.name || blog.user?.username || 'unknown'}
      </div>

      {isOwner && (
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleDelete}
            style={{
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            remove
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog
