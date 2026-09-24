import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Box, Link } from '@mui/material'
import blogService from '../services/blogs'

const Blog = ({ blogs, removeBlog, handleLike, loggedInUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return (
      <Typography variant="body1" sx={{ p: 2, color: 'text.secondary' }}>
        Loading blog data...
      </Typography>
    )
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
    <Card variant="outlined" sx={{ mt: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          {blog.title}
        </Typography>

        <Typography variant="h6" component="h2" color="text.secondary" sx={{ mb: 2 }}>
          by {blog.author || 'Unknown Author'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Link href={blog.url} target="_blank" rel="noreferrer" variant="body1" underline="hover" sx={{ wordBreak: 'break-all' }}>
            {blog.url}
          </Link>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
            likes {blog.likes} like
          </Typography>
          {loggedInUser && (
            <Button variant="outlined" size="small" onClick={liking} sx={{ borderRadius: 1.5 }}>
              like
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: isOwner ? 2 : 0 }}>
          Added by {blog.user?.name || blog.user?.username || 'unknown'}
        </Typography>

        {isOwner && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="error" size="small" onClick={handleDelete} disableElevation sx={{ borderRadius: 1.5 }}>
              remove
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
