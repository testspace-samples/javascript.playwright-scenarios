const { expect } = require('@playwright/test');

/**
 * Component: newProject
 * Description: Component to create a new Standalone project
 *
 * Steps:
 *   1. Navigate to $env.BASE_URL
 *   2. Click on "New Project"
 *   3. Click on "STANDALONE"
 *   4. Enter name for the project
 *   5. Click on project description
 *   6. Enter project description
 *   7. Click on "SUBMIT"
 *   8. Submit new project dialog
 */
async function newprojectComponent(page) {
  // Inputs — handle every declared input, even if not used in steps
  const projectName_6 = process.env.projectName_6;
  if (!projectName_6) throw new Error("Required input projectName_6 is not set");

  // Environment variables
  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) throw new Error('Environment variable BASE_URL is required but not defined');

  // Step 1: Navigate to $env.BASE_URL
  await page.goto(BASE_URL);

  // Step 2: Click on "New Project"
  // data-remote="true" — AJAX call loads dialog inline, no page navigation
  await page.getByRole('link', { name: 'New Project' }).click();
  // Wait for AJAX-loaded dialog to render before interacting (composite flow, data-remote link)
  await page.locator('.overmind-dialog-container').waitFor({ state: 'visible' });

  // Step 3: Click on "STANDALONE"
  await page.locator('#new-connected-project-dialog').getByRole('button', { name: 'Standalone', exact: true }).click();
  // Multi-step dialog transition: wait for New Project form dialog to appear
  await page.locator('#new-project-dialog').waitFor({ state: 'visible' });

  // Step 4: Enter name for the project
  await page.locator('#new-project-dialog').getByLabel('Name').fill(projectName_6);

  // Step 5: Click on project description
  // Step 6: Enter project description
  // fill() focuses the element automatically — click + fill collapsed into single call
  await page.locator('#new-project-dialog').getByLabel('Description').fill('this is a new standalone project');

  // Step 7: Click on "SUBMIT"
  await page.locator('#new-project-dialog').getByRole('button', { name: 'Submit', exact: true }).click();

  // Step 8: Submit new project dialog
  // Submit event triggered by click above — wait for post-submit navigation to complete
  // Form action is POST /projects (collection path) — redirect returns to projects listing
  await page.waitForLoadState('domcontentloaded');
}

module.exports = { newprojectComponent };
