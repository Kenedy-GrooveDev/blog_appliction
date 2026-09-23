import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    // Changed this line to match any javascript file inside the e2e-test directory
    files: ['e2e-test/**/*.js', 'playwright.teardown.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
]
