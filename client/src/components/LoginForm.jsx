import {
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material'

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 0.5,
        }}
      >
        Account login
      </Typography>

      <TextField
        label="username:"
        id="username-input"
        variant="outlined"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        required
        fullWidth
        autoFocus
        size="small"
      />

      <TextField
        label="password:"
        id="password-input"
        variant="outlined"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        required
        fullWidth
        size="small"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
        fullWidth
        sx={{
          mt: 0.5,
          py: 1,
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        }}
      >
        login
      </Button>
    </Box>
  )
}

export default LoginForm
