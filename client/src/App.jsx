import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginServices from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Home from './pages/Home'
import Blog from './pages/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)

  const localStorageUser = 'loggedBlogUser'
  const navigate = useNavigate() // Hook to redirect users after logging in

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUser)
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(prevBlogs => [...prevBlogs, createdBlog])
      setNotifyMessage({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        variant: 'green'
      })
    } catch (error) {
      setNotifyMessage({
        message: error.response?.data?.error || 'Failed to create blog',
        variant: 'red'
      })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginServices.login({ username, password })
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
        variant: 'green'
      })
      navigate('/') // Smoothly bounce back to Home page view after access authorization
    } catch (error) {
      console.log(error)
      setNotifyMessage({
        message: 'wrong username or password',
        variant: 'red'
      })
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem(localStorageUser)
    setNotifyMessage({
      message: 'Logged out Successfully',
      variant: 'green'
    })
    setUser(null)
    navigate('/login') // Redirect to login page on logout
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: typeof blog.user === 'object' ? blog.user.id : blog.user
      }
      const returnedBlog = await blogService.update(updatedBlog, blog.id)
      setBlogs(prevBlogs =>
        prevBlogs.map(currentBlog =>
          currentBlog.id === returnedBlog.id ? returnedBlog : currentBlog
        )
      )
    } catch (error) {
      console.log(error)
      setNotifyMessage({
        message: 'Failed to like blog',
        variant: 'red'
      })
    }
  }

  const removeBlog = (id) => {
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id))
    setNotifyMessage({
      message: 'Blog removed successfully',
      variant: 'green'
    })
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {/* Navigation bar is always visible on top */}
      <Navigation user={user} handleLogOut={handleLogOut} />

      <h2>blogs</h2>

      {notifyMessage && (
        <Notification
          message={notifyMessage.message}
          variant={notifyMessage.variant}
        />
      )}

      {/* Route Switchboard */}
      <Routes>
        <Route path="/login" element={
          <Login
            handleLogin={handleLogin}
            setPassword={setPassword}
            setUsername={setUsername}
            username={username}
            password={password}
          />
        } />

        <Route path="/" element={
          (
            <div>
              <Home
                removeBlog={removeBlog}
                sortedBlogs={sortedBlogs}
                handleLike={handleLike}
                user={user}
              />
            </div>
          )
        } />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              removeBlog={removeBlog}
              handleLike={handleLike}
              loggedInUser={user}
              blogs={sortedBlogs}
            />
          }
        />
        <Route path='create' element={
          <BlogForm createBlog={handleCreate} />
        } />
      </Routes>
    </div>
  )
}

export default App
