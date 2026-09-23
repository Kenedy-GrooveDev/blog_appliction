const login = async (page, username, password) => {
  await page.getByLabel('username:').fill(username)
  await page.getByLabel('password:').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  // "new blog" is a Link in the Navigation component
  await page.getByRole('link', { name: 'new blog' }).click()

  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)

  // "create" is the submit button inside the form
  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = { login, createBlog }
