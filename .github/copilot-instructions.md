# Copilot Instructions

## Application Under Test

Testspace (s2testorg.stridespace.com) — a test management SaaS.

## Hamburger / Options Menu (DETAILS[data-url])

Projects, Spaces, and other list items expose a hamburger menu via a `<details data-url="/resource/:id/menu">` element inside each table row. Menu content is **AJAX-fetched** when the details element opens.

```javascript
// Find the row by item name
const row = page.locator('tr', { has: page.getByText(itemName, { exact: true }) });

// Hover, then click the <summary> element via page.evaluate —
// clicking <summary> is the reliable semantic toggle for <details data-url>;
// page.evaluate bypasses Playwright's visibility constraints
await row.hover();
await page.evaluate((name) => {
  const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
  const row = link?.closest('tr');
  row?.querySelector('details summary')?.click();
}, itemName);

// Wait for AJAX menu content (scoped to row), then click the action —
// CRITICAL: scope the querySelector to the row — document.querySelector will hit the first
// (possibly empty) .options-menu in DOM order, which may not be the one that just loaded
await row.locator('.options-menu').waitFor({ state: 'visible' });
await page.evaluate((name) => {
  const link = Array.from(document.querySelectorAll('tr a')).find(a => a.textContent.trim() === name);
  const row = link?.closest('tr');
  row?.querySelector('.options-menu a[data-method="delete"]')?.click();
}, itemName);
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
// After destructive confirmation, do an explicit goto to bypass Turbolinks cache-preview —
// Turbolinks may serve a stale cached page before the real GET completes, causing assertions
// to run against old DOM. page.goto forces a fresh server-rendered response.
await page.goto(BASE_URL + '/expected-path');
await page.waitForLoadState('domcontentloaded');
```
