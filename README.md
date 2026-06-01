# JavaScript Playwright Scenarios

Minimal Playwright setup for JavaScript-based browser scenarios with:

- HTML reporting
- JUnit XML reporting
- Optional `.env` support via `dotenv`
- A hello-world smoke test
- Common npm scripts for local execution

## Prerequisites

- Node.js 20+
- npm 10+

## Initial setup

If starting from an empty folder, create a project manifest:

```bash
npm init -y
```

Install project dependencies:

```bash
npm install --save-dev @playwright/test dotenv
```

Optional: create a local environment file from the example:

```bash
cp .env.example .env
```

Install the browser used by this starter project:

```bash
npx playwright install chromium
```

Run the hello-world verification test:

```bash
npm run test:hello
```

## Running tests

Run all tests:

```bash
npm test
```

Run a single file directly:

```bash
npx playwright test tests/hello-world.spec.js
```

Run headed mode:

```bash
npm run test:headed
```

Run with Playwright UI mode:

```bash
npm run test:ui
```

Run in debug mode:

```bash
npm run test:debug
```

## Reports

Every test run writes:

- HTML report to `playwright-report/`
- JUnit XML to `test-results/junit/results.xml`

Open the HTML report after a run:

```bash
npm run report:html
```

## CI (GitHub Actions)

A minimal workflow is included at `.github/workflows/ci.yml`.

It runs on:

- push to `main` or `master`
- pull requests
- manual trigger via `workflow_dispatch`
- repository dispatch event type `workspace_dispatch`

The workflow uploads both:

- JUnit XML report
- Playwright HTML report

### Testspace publishing

The workflow can also publish JUnit results to Testspace.

The workflow is configured to publish to the Testspace staging server:

- `samples.stridespace.com`

CI publishes:

- test-results/junit/results.xml

## Changing the target URL

The sample test uses `BASE_URL` and defaults to `https://example.com`.

You can store it in a `.env` file:

```bash
BASE_URL=https://example.com
```

Example:

```bash
BASE_URL=https://playwright.dev npm run test:hello
```

If you change `BASE_URL`, update the sample assertions to match that page.

## Project structure

```text
.
|-- package.json
|-- playwright.config.js
|-- README.md
`-- tests/
    `-- hello-world.spec.js
```
