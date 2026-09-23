import { Box } from '@mui/material'
import BlogList from '../components/BlogList'
import Notification from '../components/Notification'

const Home = ({
  sortedBlogs,
  notifyMessage,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Notification
        message={notifyMessage?.message}
        variant={notifyMessage?.variant}
      />

      <BlogList blogs={sortedBlogs} />
    </Box>
  )
}

export default Home
