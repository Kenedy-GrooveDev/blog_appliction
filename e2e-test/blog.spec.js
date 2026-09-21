const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  test.describe.configure({ timeout: 40_000 })

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username:')).toBeVisible()
    await expect(page.getByLabel('password:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')

      const notification = page.locator('.notify')

      await expect(
        notification.getByText('Welcome back, Matti Luukkainen')
      ).toBeVisible()

      await expect(notification).toHaveCSS(
        'border-color',
        'rgb(0, 128, 0)'
      )
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'wrong')

      const notification = page.locator('.notify')

      await expect(
        notification.getByText('wrong username or password')
      ).toBeVisible()

      await expect(notification).toHaveCSS(
        'border-color',
        'rgb(255, 0, 0)'
      )
    })
  })

  describe('When logged in', () => {
    const title = 'Automating End to End UI Tests with Playwright'
    const author = 'Matti Luukkainen'

    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
      await createBlog(page, title, author, 'https://fullstackopen.com')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(
        page.locator('.blog-title', { hasText: `${title} ${author}` })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = page.locator('.blog-container', { hasText: title })

      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()

      await expect(blog.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be successfully deleted by the creator', async ({ page }) => {
      const blog = page.locator('.blog-container', { hasText: title })

      page.once('dialog', dialog => dialog.accept())

      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.locator('.blog-container', { hasText: title })
      ).toHaveCount(0)
    })

    test('only the creator can see the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'secret'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await login(page, 'otheruser', 'secret')

      const blog = page.locator('.blog-container', { hasText: title })

      await blog.getByRole('button', { name: 'view' }).click()

      await expect(
        blog.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      const leastLiked = 'Least liked blog'
      const mediumLiked = 'Medium liked blog'
      const mostLiked = 'Most liked blog'

      await createBlog(
        page,
        leastLiked,
        'Test Author',
        'https://example.com/least'
      )

      await createBlog(
        page,
        mediumLiked,
        'Test Author',
        'https://example.com/medium'
      )

      await createBlog(
        page,
        mostLiked,
        'Test Author',
        'https://example.com/most'
      )

      const likeBlog = async (blogTitle, numberOfLikes) => {
        const blog = page.locator('.blog-container', { hasText: blogTitle })

        await blog.getByRole('button', { name: 'view' }).click()

        for (let likes = 1; likes <= numberOfLikes; likes += 1) {
          await blog.getByRole('button', { name: 'like' }).click()

          await expect(
            blog.getByText(`likes: ${likes}`)
          ).toBeVisible()
        }
      }

      await likeBlog(leastLiked, 1)
      await likeBlog(mediumLiked, 2)
      await likeBlog(mostLiked, 3)

      const blogs = page.locator('.blog-container')

      await expect(blogs.nth(0)).toContainText(mostLiked)
      await expect(blogs.nth(1)).toContainText(mediumLiked)
      await expect(blogs.nth(2)).toContainText(leastLiked)
      await expect(blogs.nth(3)).toContainText(title)
    })
  })
})