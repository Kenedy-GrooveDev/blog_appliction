import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('renders title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kenedy',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'kenedy_dev',
      name: 'Kenedy'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library Kenedy')
  expect(element).toBeDefined()
})

test('checks that the blogs URL and number of likes are shown when the view button has been clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kenedy',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'kenedy_dev',
      name: 'Kenedy'
    }
  }

  render(<Blog blog={blog} />)

  const initialUrl = screen.queryByText('https://example.com')
  const initialLikes = screen.queryByText(/likes: 5/)
  expect(initialUrl).toBeNull()
  expect(initialLikes).toBeNull()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('https://example.com')
  const likesElement = screen.getByText(/likes: 5/)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing handles mock event spies',
    author: 'Kenedy',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'kenedy_dev',
      name: 'Kenedy'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('the form calls the event handler with the right details when a new blog is created', async () => {
  const newBlog = {
    title: 'Mastering Integration Testing in Full Stack Open',
    author: 'Kenedy',
    url: 'https://example.com'
  }

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)

  await user.click(submitButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe(newBlog.title)
  expect(mockHandler.mock.calls[0][0].author).toBe(newBlog.author)
  expect(mockHandler.mock.calls[0][0].url).toBe(newBlog.url)
})
