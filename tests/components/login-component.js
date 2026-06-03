const { expect } = require('@playwright/test');

/**
 * Component: login
 * Description: Component to login into Testspace
 *
 * Steps:
 *   1. Navigate to $env.BASE_URL
 *   2. Click on username or email address
 *   3. Enter 'testuser' in username or email address
 *   4. Press Tab on username or email address
 *   5. Enter password
 *   6. Click on "SUBMIT"
 *   7. Submit signin form
 *   8. Navigate to $env.BASE_URL
 */
async function loginComponent(page) {
  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) throw new Error('Environment variable BASE_URL is required but not defined');
  const PASSWORD = process.env.PASSWORD;
  if (!PASSWORD) throw new Error('Environment variable PASSWORD is required but not defined');

  // Step 1: Navigate to $env.BASE_URL
  await page.goto(BASE_URL);

  // Step 2: Click on username or email address
  // Step 3: Enter 'testuser' in username or email address
  await page.getByPlaceholder('username or email address').fill('testuser');

  // Step 4: Press Tab on username or email address
  await page.getByPlaceholder('username or email address').press('Tab');

  // Step 5: Enter password
  await page.getByPlaceholder('password').fill(PASSWORD);

  // Step 6: Click on "SUBMIT"
  // Step 7: Submit signin form
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  // The signin form uses data-remote="true" (Rails UJS); Turbolinks follows the server redirect
  // as a top-level navigation away from signin.stridespace.com.
  await page.waitForURL(url => !url.hostname.startsWith('signin.'), { timeout: 30000 });

  // Step 8: Navigate to $env.BASE_URL
  await page.goto(BASE_URL);
}

module.exports = { loginComponent };
