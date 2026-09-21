const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <label>
        username:
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </label>
      <br></br>
      <label>
        password:
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </label>
      <br />
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
