const mongoose = require('mongoose')
const path = require('path')
const Blog = require('./models/blog')

const dns = require('node:dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

// Load the root .env file
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const url = process.env.MONGODB_URI

if (!url) {
  console.error('❌ MONGODB_URI is undefined.')
  process.exit(1)
}

// These are ONLY the blogs created by the E2E tests.
const testBlogTitles = [
  'Least liked blog',
  'Medium liked blog',
  'Most liked blog',
  'Automating End to End UI Tests with Playwright',
]

const purgeDuplicateTestBlogs = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(url)
    console.log('✅ Connected successfully.')

    console.log('\n🧹 Removing E2E test blogs...')

    const result = await Blog.deleteMany({
      title: { $in: testBlogTitles },
    })

    console.log(
      `✅ Removed ${result.deletedCount} E2E test blog(s).`
    )
  } catch (error) {
    console.error(
      '❌ Database cleanup failed:',
      error.message
    )

    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed.')
  }
}

purgeDuplicateTestBlogs()
