# Copilot Instructions

## Application Under Test

Testspace (s2testorg.stridespace.com) — a test management SaaS.

## Hamburger / Options Menu (DETAILS[data-url])

Projects, Spaces, and other list items expose a hamburger menu via a `<details data-url="/resource/:id/menu">` element inside each table row. Menu content is **AJAX-fetched** when the details element opens.

```javascript
// Find the row by item name
const row = page.locator('tr', { has: page.getByText(itemName, { exact: true }) });

// Hover to reveal the summary button (CSS :hover), then click the icon via page.evaluate —
// Playwright's synthetic click on CSS-hidden elements does not reliably trigger the DETAILS toggle
await row.hover();
await page.evaluate((name) => {
  const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
  const row = link?.closest('tr');
  row?.querySelector('.icon-three-bars')?.click();
}, itemName);

// Wait for AJAX menu content (scoped to row), then click the action via page.evaluate
await row.locator('.options-menu').waitFor({ state: 'visible' });
await page.evaluate(() => {
  document.querySelector('.options-menu a[data-method="delete"]').click();
});
```

## Confirmation Dialog (overmind)

Destructive actions (delete, etc.) open a confirmation dialog injected via `data-remote="true"` XHR. The dialog re-renders after injection — Playwright's normal `.click()` fails with "element was detached from DOM".

```javascript
// Wait on the button (not just the container — the container shell pre-exists empty)
await page.locator('.overmind-dialog-container button[type="submit"]').waitFor({ state: 'visible' });
// Dispatch click synchronously in-page to bypass detachment retries
await page.evaluate(() => {
  document.querySelector('.overmind-dialog-container button[type="submit"]').click();
});
// For destructive actions use waitForURL, not waitForLoadState
await page.waitForURL(url => url.pathname === '/expected-path', { timeout: 15000 });
```
