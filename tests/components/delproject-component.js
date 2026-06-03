/**
 * Component: delProject
 * Description: Component to delete a project
 *
 * Steps:
 *   1. Navigate to $env.BASE_URL
 *   2. Click on "Projects"
 *   3. Click on options menu
 *   4. Click on "Delete"
 *   5. Click on "YES"
 *   6. Submit form
 */
async function delprojectComponent(page) {
  const projectName_7 = process.env.projectName_7;
  if (!projectName_7) throw new Error("Required input projectName_7 is not set");

  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) throw new Error('Environment variable BASE_URL is required but not defined');

  // Step 1: Navigate to $env.BASE_URL
  await page.goto(BASE_URL);

  // Step 2: Click on "Projects"
  await page.locator('#header').getByRole('link', { name: 'Projects' }).click();
  await page.waitForURL(/\/projects$/);

  // Step 3: Click on options menu
  const projectRow = page.locator('tr', { has: page.getByText(projectName_7, { exact: true }) });
  await projectRow.hover();
  // Use page.evaluate to fire the icon click — the icon is CSS-hidden until hover and
  // Playwright's synthetic click does not reliably trigger the DETAILS toggle in Chromium
  await page.evaluate((name) => {
    const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
    const row = link?.closest('tr');
    row?.querySelector('.icon-three-bars')?.click();
  }, projectName_7);

  // Step 4: Click on "Delete"
  // DETAILS[data-url] — content is AJAX-injected; page.evaluate bypasses event synthesis
  await projectRow.locator('.options-menu').waitFor({ state: 'visible' });
  await page.evaluate(() => {
    document.querySelector('.options-menu a[data-method="delete"]').click();
  });

  // Step 5: Click on "YES"
  // Step 6: Submit form
  // Register DELETE response capture BEFORE clicking YES
  const deletePromise = page.waitForResponse(
    resp => resp.request().method() === 'DELETE' && resp.url().includes('/projects/'),
    { timeout: 15000 }
  );
  // overmind dialog is AJAX-injected — page.evaluate bypasses stability check on re-renders
  await page.locator('.overmind-dialog-container button[type="submit"]').waitFor({ state: 'visible' });
  await page.evaluate(() => {
    document.querySelector('.overmind-dialog-container button[type="submit"]').click();
  });
  await deletePromise;
  // Turbolinks reloads the page — wait for the project row to disappear
  await page.locator('tr', { has: page.getByText(projectName_7, { exact: true }) }).waitFor({ state: 'detached', timeout: 15000 });
}

module.exports = { delprojectComponent };
