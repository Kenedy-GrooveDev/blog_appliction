import LoginForm from '../components/LoginForm'
import Notification from '../components/Notification'

const Login = ({ notifyMessage, setPassword, setUsername, handleLogin, username, password }) => (
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

export default Login
