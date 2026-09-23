const { test, expect } = require('@playwright/test')
const { login, createBlog } = require('./helper')

test.describe('Blog app', () => {
  test.describe.configure({ timeout: 40_000 })

  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3003/api/testing/reset')

    // Create test user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    const loginHeading = page.getByRole('heading', { name: /log in/i })
    const fallbackText = page.getByText(/log in to application/i)

    await expect(loginHeading.or(fallbackText).first()).toBeVisible()
    await expect(page.getByLabel('username:')).toBeVisible()
    await expect(page.getByLabel('password:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')

      await login(page, 'mluukkai', 'salainen')

      const notification = page.locator('.notify')

      await expect(
        notification.getByText('Welcome back, Matti Luukkainen!'),
      ).toBeVisible()

      await expect(notification).toHaveCSS('border-color', 'rgb(0, 128, 0)')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')

      await login(page, 'mluukkai', 'wrong')

      const notification = page.locator('.notify')

      await expect(
        notification.getByText('wrong username or password'),
      ).toBeVisible()

      await expect(notification).toHaveCSS('border-color', 'rgb(255, 0, 0)')
    })
  })

  test.describe('When logged in', () => {
    const title = 'Automating End to End UI Tests with Playwright'
    const author = 'Matti Luukkainen'
    const titleRegex = new RegExp(title, 'i')

    test.beforeEach(async ({ page }) => {
      // Login
      await page.goto('http://localhost:5173/login')
      await login(page, 'mluukkai', 'salainen')

      // Create the blog
      await createBlog(page, title, author, 'https://fullstackopen.com')

      // Go back to the blogs page.
      // Your Navigation component has:
      // <Link to="/">blogs</Link>
      await page.getByRole('link', { name: 'blogs' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByRole('link', { name: titleRegex })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // Open the blog
      await page.getByRole('link', { name: titleRegex }).first().click()

      // Make sure we are on the blog page
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()

      // Like the blog
      await page.getByRole('button', { name: 'like' }).click()

      // Check likes
      await expect(page.getByText(/likes \d+/)).toContainText('likes 1 like')

      // Go back to blogs
      await page.getByRole('link', { name: 'blogs' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
    })

    test('a blog can be successfully deleted by the creator', async ({
      page,
    }) => {
      // Open the blog
      await page.getByRole('link', { name: titleRegex }).first().click()

      // Accept the confirmation dialog
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Remove blog')
        await dialog.accept()
      })

      // Delete the blog
      await page.getByRole('button', { name: 'remove' }).click()

      // After deletion, the application should return to blogs
      await expect(page).toHaveURL('http://localhost:5173/')

      // The deleted blog should no longer exist
      await expect(page.getByRole('link', { name: titleRegex })).toHaveCount(0)
    })

    test('only the creator can see the remove button', async ({
      page,
      request,
    }) => {
      // Create another user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'secret',
        },
      })

      // Log out Matti
      await page.getByRole('button', { name: 'logout' }).click()

      // Log in as another user
      await page.goto('http://localhost:5173/login')
      await login(page, 'otheruser', 'secret')

      // Go to blogs
      await page.getByRole('link', { name: 'blogs' }).click()

      // Open Matti's blog
      await page.getByRole('link', { name: titleRegex }).first().click()

      // Other user must not see the remove button
      await expect(
        page.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()

      // Return to blogs
      await page.getByRole('link', { name: 'blogs' }).click()
    })
  })
})
