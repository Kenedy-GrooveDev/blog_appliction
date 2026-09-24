import {
  Box,
  Paper,
  Typography,
  Container,
} from '@mui/material'

import LoginForm from '../components/LoginForm'
import Notification from '../components/Notification'

const Login = ({
  notifyMessage,
  setPassword,
  setUsername,
  handleLogin,
  username,
  password,
}) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: { xs: 4, sm: 8 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 4 },
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Log in
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Sign in to access your blog application.
          </Typography>

          <Notification
            message={notifyMessage?.message}
            variant={notifyMessage?.variant}
          />

          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            handleUsernameChange={({ target }) =>
              setUsername(target.value)
            }
            handlePasswordChange={({ target }) =>
              setPassword(target.value)
            }
          />
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
