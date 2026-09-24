import { useEffect, useState } from 'react'
import { Alert } from '@mui/material'

const Notification = ({ message, variant }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [message])

  if (!message || !visible) {
    return null
  }

  return (
    <Alert
      className="notify"
      severity={variant === 'red' ? 'error' : 'success'}
      variant="outlined"
      onClose={() => setVisible(false)}
      sx={{
        mb: 2,
        width: '100%',
        borderRadius: 1,
        borderColor:
          variant === 'red'
            ? 'rgb(255, 0, 0)'
            : 'rgb(0, 128, 0)',
      }}
    >
      {message}
    </Alert>
  )
}

export default Notification
