import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'

const Navigation = ({ user, handleLogOut }) => {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}>
          BlogSpace
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          {user ? (
            <>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
              <Typography variant="body2" sx={{ mx: 2, opacity: 0.9, fontWeight: 500 }}>
                {user.name} logged in
              </Typography>
              <Button color="error" variant="contained" onClick={handleLogOut} size="small" disableElevation>
                logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
