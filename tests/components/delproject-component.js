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
  // Click the <summary> element — the semantic toggle for <details data-url>
  // page.evaluate bypasses Playwright's visibility model; summary is always in DOM regardless of hover state
  await page.evaluate((name) => {
    const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
    const row = link?.closest('tr');
    row?.querySelector('details summary')?.click();
  }, projectName_7);

  // Step 4: Click on "Delete"
  // DETAILS[data-url] — content is AJAX-injected; page.evaluate bypasses event synthesis
  // Scope to the correct row to avoid hitting another row's empty options-menu
  await projectRow.locator('.options-menu').waitFor({ state: 'visible' });
  await page.evaluate((name) => {
    const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
    const row = link?.closest('tr');
    row?.querySelector('.options-menu a[data-method="delete"]')?.click();
  }, projectName_7);

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
  // Explicit goto bypasses Turbolinks cache-preview — guarantees fresh server-rendered /projects page
  await page.goto(`${BASE_URL}/projects`);
  await page.waitForLoadState('domcontentloaded');
}

module.exports = { delprojectComponent };
