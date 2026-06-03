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

## Getting started

Clone the repo and install dependencies:

```bash
npm install
```

Install the browser:

```bash
npx playwright install chromium
```

Copy the environment file and set `BASE_URL` to your target server:

```bash
cp .env.example .env
```

Run the hello-world verification test:

```bash
npm run test:hello
```

## Starting from scratch

If you are creating a new project rather than cloning this one:

```bash
npm init -y
npm install --save-dev @playwright/test dotenv
npx playwright install chromium
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

Run with Playwright UI mode (interactive, useful for debugging):

```bash
npm run test:ui
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

`BASE_URL` must be set before running tests. Set it in your `.env` file:

```bash
BASE_URL=https://your-server.example.com
```

Or pass it inline:

```bash
BASE_URL=https://your-server.example.com npm test
```

## Project structure

```text
.
|-- package.json
|-- playwright.config.js
|-- README.md
`-- tests/
    `-- hello-world.spec.js
```
