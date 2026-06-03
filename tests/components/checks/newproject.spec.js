// NOTE: This spec runs login (setup) + newprojectComponent + delprojectComponent (teardown) — 3 components.
// The combined chain carries significantly higher timeout risk. Consider increasing the configured
// Playwright timeout to at least 90000ms in playwright.config.js if this test times out in CI.

const { test, expect } = require('@playwright/test');
const { loginComponent } = require('../login-component');
const { delprojectComponent } = require('../delproject-component');
const { newprojectComponent } = require('../newproject-component');

test.describe("newProject", () => {
  test.beforeEach(async ({ page }) => {
    await loginComponent(page);
  });

  test.afterEach(async ({ page }) => {
    const projectname7EnvValue = process.env.projectName_6;
    if (projectname7EnvValue === undefined) {
      throw new Error("Missing required environment variable projectName_6 for component input projectName_7");
    }
    process.env.projectName_7 = projectname7EnvValue;
    await delprojectComponent(page);
  });

  test("Confirm New Project", async ({ page }) => {
    // Check if the new standalone project is created
    // Guidance: set projectName_6 to "test-<3-digit-random-number>" (e.g., "test-123") if not provided
    const projectname6EnvValue = process.env.projectName_6 ||
      `test-${String(Math.floor(Math.random() * 900) + 100)}`;
    process.env.projectName_6 = projectname6EnvValue;
    await newprojectComponent(page);

    // Step: EXPECT: TH: testProject my test project
    // Instructions: Use projectName_6 to confirm created
    await expect(page.getByRole('link', { name: projectname6EnvValue, exact: true })).toBeVisible();
  });

});
