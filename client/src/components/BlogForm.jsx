import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <label>
        title:
        <input
          type="text"
          value={title}
          name="title"
          placeholder="write title here"
          onChange={({ target }) => setTitle(target.value)}
        />
      </label><br />
      <label>
        author:
        <input
          type="text"
          value={author}
          name="author"
          placeholder="write author here"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </label><br />
      <label>
        url:
        <input
          type="text"
          value={url}
          name="url"
          placeholder="write url here"
          onChange={({ target }) => setUrl(target.value)}
        />
      </label><br />
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
