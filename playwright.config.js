import { defineConfig } from '@playwright/test'

export default defineConfig({
  // 🎯 Forces Playwright to only search the e2e-test folder (ignores Vitest files)
  testDir: './e2e-test',

  /* ⚙️ CRITICAL DATABASE CONTEXT FIXES */
  workers: 1, // Force tests to execute one at a time (sequential)
  fullyParallel: false, // Disable parallel file matching to stop shared DB race conditions

  // 📝 Generate minimal dot logs locally, but build an HTML report for artifact upload in CI
  reporter: process.env.CI ? 'html' : 'dot',

  /* Run your local frontend and test backend before starting the tests */
  webServer: {
    command: 'npm run dev:test', // 🧭 Points to our environment-locked script
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'test',
    },
  },

  use: {
    baseURL: 'http://localhost:5173',
    // 📸 Capture snapshots or recordings when a CI run fails to make debugging straightforward
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
