import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id} ><Link to={`/blogs/${blog.id}`} data-testid="blog-link">{blog.title} by {blog.author}</Link></li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
