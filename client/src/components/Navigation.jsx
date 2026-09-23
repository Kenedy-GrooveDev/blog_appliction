import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogOut }) => {
  const padding = { padding: 5 }

  return (
    <nav>
      <Link style={padding} to="/">blogs</Link>

      {user ? (
        <>
          <Link style={padding} to="/create">new blog</Link>
          <button onClick={handleLogOut}>logout</button>
        </>
      ) : (
        <Link style={padding} to="/login">login</Link>
      )}
    </nav>
  )
}

export default Navigation
