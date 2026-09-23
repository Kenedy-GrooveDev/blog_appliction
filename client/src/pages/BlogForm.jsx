import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Create new blog
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Add a new blog post to your collection.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={2.5}>
            <TextField
              label="title:"
              name="title"
              value={title}
              placeholder="Enter blog title"
              onChange={({ target }) => setTitle(target.value)}
              fullWidth
              required
            />

            <TextField
              label="author:"
              name="author"
              value={author}
              placeholder="Enter author name"
              onChange={({ target }) => setAuthor(target.value)}
              fullWidth
              required
            />

            <TextField
              label="url:"
              name="url"
              value={url}
              placeholder="https://example.com"
              onChange={({ target }) => setUrl(target.value)}
              fullWidth
              required
              type="url"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                alignSelf: 'flex-start',
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              create
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default BlogForm
