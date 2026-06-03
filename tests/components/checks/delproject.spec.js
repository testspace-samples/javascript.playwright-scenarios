// NOTE: This spec runs a composite fixture chain: loginComponent (setup) + newprojectComponent (setup)
// + delprojectComponent (test) — 3 components total. The effective Playwright timeout may need to be
// increased to at least 90000ms in playwright.config.js if this test times out in CI.

const { test, expect } = require('@playwright/test');
const { loginComponent } = require('../login-component');
const { newprojectComponent } = require('../newproject-component');
const { delprojectComponent } = require('../delproject-component');

// Set projectName_7 to "delete-abc" where abc is a 3-digit random number (validation_requirements).
// Must be assigned at module level so beforeEach can read it when wiring newProject's projectName_6 input.
if (!process.env.projectName_7) {
  process.env.projectName_7 = `delete-${String(Math.floor(Math.random() * 900) + 100)}`;
}

test.describe("delProject", () => {
  test.beforeEach(async ({ page }) => {
    await loginComponent(page);
    const projectname6EnvValue = process.env.projectName_7;
    if (projectname6EnvValue === undefined) {
      throw new Error("Missing required environment variable projectName_7 for component input projectName_6");
    }
    process.env.projectName_6 = projectname6EnvValue;
    await newprojectComponent(page);
  });

  test("Check", async ({ page }) => {
    // Validate that component can delete a project
    const projectname7EnvValue = process.env.projectName_7;
    if (projectname7EnvValue === undefined) {
      throw new Error("Missing required environment variable projectName_7 for component input projectName_7");
    }
    process.env.projectName_7 = projectname7EnvValue;
    await delprojectComponent(page);

    // After project is deleted, confirm it is no longer in the projects listing
    // not.toBeAttached() — DOM node should be entirely removed, not merely hidden
    await expect(
      page.locator('#wrapper').getByRole('link', { name: projectname7EnvValue, exact: true })
    ).not.toBeAttached();
  });

});
