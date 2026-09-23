const path = require('path')

// Force absolute configuration path evaluation from the root folder
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const PORT = process.env.PORT

// 🔒 THE ABSOLUTE OVERRIDE TRAP:
// If USE_TEST_DB is declared OR NODE_ENV is strictly 'test', force the isolated db connection string!
const MONGODB_URI = (process.env.USE_TEST_DB === 'true' || process.env.NODE_ENV === 'test')
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = { PORT, MONGODB_URI }
