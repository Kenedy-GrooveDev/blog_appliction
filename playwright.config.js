import { defineConfig } from '@playwright/test'

export default defineConfig({
  // ... your other config options (testDir, projects, etc.)

  /* ⚙️ CRITICAL DATABASE CONTEXT FIXES */
  workers: 1, // Force tests to execute one at a time (sequential)
  fullyParallel: false, // Disable parallel file matching to stop shared DB race conditions

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
  },
})
