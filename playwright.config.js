require('dotenv').config();

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set. Copy .env.example to .env and update BASE_URL.');
}

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  outputDir: 'test-results/artifacts'
});