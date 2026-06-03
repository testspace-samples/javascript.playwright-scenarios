const { test, expect } = require('@playwright/test');
const { loginComponent } = require('../login-component');

test.describe("login", () => {
  test("check domain", async ({ page }) => {
    // Confirm that the correct domain is being used
    const BASE_URL = process.env.BASE_URL || 'https://s2testorg.stridespace.com/';
    process.env.BASE_URL = BASE_URL;
    const PASSWORD = process.env.PASSWORD || '';
    process.env.PASSWORD = PASSWORD;

    await loginComponent(page);

    // Step: EXPECT: DIV: s2testorg Help Mark Underseth
    // Confirm "s2testorg" domain — assert org name is present in the page header
    // No role available for DIV.header-top — CSS class scoped to stable #header ancestor
    await expect(page.locator('#header .header-top')).toContainText('s2testorg');
  });

});
