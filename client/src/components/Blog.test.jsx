import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import Blog from '../pages/Blog'
import BlogForm from '../pages/BlogForm'

const mockBlogId = '69ca37cc1a2b3c4d5e6f7g8h'

const blogData = {
  id: mockBlogId,
  title: 'Component testing is done with react-testing-library',
  author: 'Kenedy',
  url: 'https://example.com',
  likes: 5,
  user: {
    id: 'creator_id_123',
    username: 'kenedy_dev',
    name: 'Kenedy',
  },
}

const renderBlogComponent = (props = {}) => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${mockBlogId}`]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={[blogData]}
              removeBlog={vi.fn()}
              handleLike={vi.fn()}
              {...props}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

test('Blog information and likes are displayed to unauthenticated users, buttons are not displayed', () => {
  renderBlogComponent({ loggedInUser: null })

  expect(
    screen.getByText(
      'Component testing is done with react-testing-library',
    ),
  ).toBeDefined()

  expect(
    screen.getByText('by Kenedy'),
  ).toBeDefined()

  expect(
    screen.getByText('https://example.com'),
  ).toBeDefined()

  expect(
    screen.getByText(/likes:? 5/i),
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: 'like' }),
  ).toBeNull()

  expect(
    screen.queryByRole('button', { name: 'remove' }),
  ).toBeNull()
})

test('Authenticated users who are not the creator are shown only the like button', () => {
  const outsiderUser = {
    id: 'outsider_id_456',
    username: 'someone_else',
    name: 'Some Body',
  }

  renderBlogComponent({ loggedInUser: outsiderUser })

  expect(
    screen.getByRole('button', { name: 'like' }),
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: 'remove' }),
  ).toBeNull()
})

test('The blog creator is shown both the like button and the delete button', () => {
  const creatorUser = {
    id: 'creator_id_123',
    username: 'kenedy_dev',
    name: 'Kenedy',
  }

  renderBlogComponent({ loggedInUser: creatorUser })

  expect(
    screen.getByRole('button', { name: 'like' }),
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: 'remove' }),
  ).toBeDefined()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const mockHandler = vi.fn()

  const outsiderUser = {
    id: 'outsider_id_456',
    username: 'someone_else',
    name: 'Some Body',
  }

  render(
    <MemoryRouter initialEntries={[`/blogs/${mockBlogId}`]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={[blogData]}
              removeBlog={vi.fn()}
              handleLike={mockHandler}
              loggedInUser={outsiderUser}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  )

  const user = userEvent.setup()

  const likeButton = screen.getByRole('button', {
    name: 'like',
  })

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('the form calls the event handler with the right details when a new blog is created', async () => {
  const newBlog = {
    title: 'Mastering Integration Testing in Full Stack Open',
    author: 'Kenedy',
    url: 'https://example.com',
  }

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  const titleInput = screen.getByPlaceholderText('Enter blog title')
  const authorInput = screen.getByPlaceholderText('Enter author name')
  const urlInput = screen.getByPlaceholderText('https://example.com')

  const submitButton = screen.getByRole('button', {
    name: 'create',
  })

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)

  await user.click(submitButton)

  expect(mockHandler.mock.calls).toHaveLength(1)

  expect(mockHandler.mock.calls[0][0].title).toBe(
    newBlog.title,
  )

  expect(mockHandler.mock.calls[0][0].author).toBe(
    newBlog.author,
  )

  expect(mockHandler.mock.calls[0][0].url).toBe(
    newBlog.url,
  )
})
