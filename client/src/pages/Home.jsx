import BlogList from '../components/BlogList'

const Home = ({ sortedBlogs }) => {
  return (
    <div>
      <BlogList blogs={sortedBlogs}/>
    </div>
  )
}

export default Home
