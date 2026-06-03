const { test, expect } = require('@playwright/test');
const { loginComponent } = require('../login-component');

test.describe("login", () => {
  test("login", async ({ page }) => {
    // TODO: Add structured test cases in the Validation panel to generate test stubs here.
    process.env.BASE_URL = process.env.BASE_URL || 'https://s2testorg.stridespace.com';
    process.env.PASSWORD = process.env.PASSWORD || '';
    await loginComponent(page);
    // Add assertions here
  });
});
