import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginServices from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)

  const localStorageUser = 'loggedBlogUser'
  const toggleRef = useRef(null)

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

      toggleRef.current.toggleVisibility()
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
    } catch (error) {
      setNotifyMessage({
        message: 'wrong username or password',
        variant: 'red'
      })
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem(localStorageUser)
    setUser(null)
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

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>

      <Notification
        message={notifyMessage?.message}
        variant={notifyMessage?.variant}
      />

      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </div>
  )

  if (user === null) {
    return loginForm()
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      {notifyMessage && (
        <Notification
          message={notifyMessage.message}
          variant={notifyMessage.variant}
        />
      )}

      <p>
        {user.name} logged in <button onClick={handleLogOut}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={toggleRef}>
        <BlogForm createBlog={handleCreate} />
      </Togglable>

      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          removeBlog={removeBlog}
          handleLike={handleLike}
          loggedInUser={user.username}
        />
      ))}
    </div>
  )
}

export default App