import { Link } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Divider,
} from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      {blogs.map((blog, index) => (
        <Box key={blog.id}>
          <Box
            component={Link}
            to={`/blogs/${blog.id}`}
            data-testid="blog-link"
            sx={{
              display: 'block',
              px: 2,
              py: 1.75,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease',

              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mb: 0.5,
              }}
            >
              {blog.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              by {blog.author}
            </Typography>
          </Box>

          {index < blogs.length - 1 && <Divider />}
        </Box>
      ))}
    </Paper>
  )
}

export default BlogList
