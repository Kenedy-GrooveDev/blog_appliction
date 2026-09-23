import { useState } from 'react'

const Notification = ({ message, variant }) => {
  const [remove, setRemove] = useState(false)


  if (!message || remove) {
    return null
  }

  return (
    <div
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: variant === 'red' ? 'red' : 'green',
        backgroundColor: 'lightgray',
        borderRadius: '15px',
        padding: '15px',
        color: variant === 'red' ? 'red' : 'green',
        marginBottom: '10px',
      }}
      className='notify'
    >
      {message}
      <button onClick={() => setRemove(true)}>X</button>
    </div>
  )
}

export default Notification
