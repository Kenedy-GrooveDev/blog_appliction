import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom'
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from '@mui/material'

import blogService from './services/blogs'
import loginServices from './services/login'

import Navigation from './components/Navigation'
import Login from './pages/Login'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogForm from './pages/BlogForm'


const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#1a237e',
    },

    secondary: {
      main: '#00bcd4',
    },

    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
  },

  shape: {
    borderRadius: 6,
  },
})


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)

  // Prevent /create from redirecting before
  // localStorage authentication has been checked.
  const [loadingUser, setLoadingUser] = useState(true)

  const localStorageUser = 'loggedBlogUser'

  const navigate = useNavigate()


  // Get all blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
      .catch(error => {
        console.log(error)
      })
  }, [])


  // Restore logged-in user from localStorage
  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem(localStorageUser)

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }

    setLoadingUser(false)
  }, [])


  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)

      setBlogs(prevBlogs => [
        ...prevBlogs,
        createdBlog,
      ])

      setNotifyMessage({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        variant: 'green',
      })

      navigate('/')
    } catch (error) {
      setNotifyMessage({
        message:
          error.response?.data?.error ||
          'Failed to create blog',
        variant: 'red',
      })
    }
  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginServices.login({
        username,
        password,
      })

      window.localStorage.setItem(
        localStorageUser,
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)

      setUser(loggedUser)

      setUsername('')
      setPassword('')

      setNotifyMessage({
        message: `Welcome back, ${loggedUser.name}!`,
        variant: 'green',
      })

      navigate('/')
    } catch (error) {
      console.log(error)

      setNotifyMessage({
        message: 'wrong username or password',
        variant: 'red',
      })
    }
  }


  const handleLogOut = () => {
    window.localStorage.removeItem(localStorageUser)

    setUser(null)

    blogService.setToken(null)

    setNotifyMessage({
      message: 'Logged out Successfully',
      variant: 'green',
    })

    navigate('/login')
  }


  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user:
          typeof blog.user === 'object'
            ? blog.user.id
            : blog.user,
      }

      const returnedBlog = await blogService.update(
        updatedBlog,
        blog.id
      )

      setBlogs(prevBlogs =>
        prevBlogs.map(currentBlog =>
          currentBlog.id === returnedBlog.id
            ? returnedBlog
            : currentBlog
        )
      )
    } catch (error) {
      console.log(error)

      setNotifyMessage({
        message: 'Failed to like blog',
        variant: 'red',
      })
    }
  }


  const removeBlog = (id) => {
    setBlogs(prevBlogs =>
      prevBlogs.filter(blog => blog.id !== id)
    )

    setNotifyMessage({
      message: 'Blog removed successfully',
      variant: 'green',
    })
  }


  const sortedBlogs = [...blogs].sort(
    (a, b) => b.likes - a.likes
  )


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        <Navigation
          user={user}
          handleLogOut={handleLogOut}
        />

        <Container
          maxWidth="md"
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
          }}
        >
          <Routes>

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                <Login
                  notifyMessage={notifyMessage}
                  handleLogin={handleLogin}
                  setPassword={setPassword}
                  setUsername={setUsername}
                  username={username}
                  password={password}
                />
              }
            />


            {/* HOME */}
            <Route
              path="/"
              element={
                <Home
                  sortedBlogs={sortedBlogs}
                  removeBlog={removeBlog}
                  handleLike={handleLike}
                  user={user}
                  notifyMessage={notifyMessage}
                />
              }
            />


            {/* CREATE BLOG */}
            <Route
              path="/create"
              element={
                loadingUser ? (
                  <Box
                    sx={{
                      minHeight: '50vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : user ? (
                  <BlogForm
                    createBlog={handleCreate}
                  />
                ) : (
                  <Navigate
                    replace
                    to="/login"
                  />
                )
              }
            />


            {/* SINGLE BLOG */}
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blogs={blogs}
                  removeBlog={removeBlog}
                  handleLike={handleLike}
                  loggedInUser={user}
                />
              }
            />

          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
