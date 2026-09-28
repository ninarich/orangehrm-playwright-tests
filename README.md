# OrangeHRM UI Tests — Playwright + JavaScript
![Playwright Tests](https://github.com/ninarich/orangehrm-playwright-tests/actions/workflows/playwright.yml/badge.svg)

UI test automation for the [OrangeHRM open-source demo](https://opensource-demo.orangehrmlive.com), an HR management web application.
The project uses **Playwright Test** with the **Page Object Model** and runs in **GitHub Actions**.

## Tech stack

- Playwright Test
- JavaScript (Node.js)
- Page Object Model
- GitHub Actions (CI)

## What is tested

17 tests covering login, the dashboard, user management, form validation and timesheets.

| File | Test | What it checks |
|---|---|---|
| login.spec.js | Login | Admin logs in and the Dashboard opens |
| dashboard.spec.js | Quick Launch | Dashboard shows 6 widgets |
| dashboard.spec.js | Buzz Latest Post | "Buzz Latest Posts" and "My Actions" widgets are not empty |
| dashboard.spec.js | Search | Menu search with every letter a–z returns only matching items |
| dashboard.spec.js | Home page | Dashboard opens by its direct link after login |
| admin.spec.js | Admin Count Links | Admin top menu has 7 links |
| admin.spec.js | Enabled or Disabled | Status column contains only "Enabled" or "Disabled" |
| admin.spec.js | Username more than one | Users table has at least one record |
| admin.spec.js | Username comparison | Search by username finds the same user |
| admin.spec.js | Delete Selected | "Delete Selected" button appears after selecting users |
| admin.spec.js | Add User All | A new user is created and found by search (end-to-end) |
| admin.spec.js | Admin count columns | Users table has 6 columns |
| admin.spec.js | array username | All usernames in the table are unique |
| admin.spec.js | Add Password | Error appears when Password and Confirm Password do not match |
| time.spec.js | Time Page validation | "Required" message appears when Employee Name is empty |
| time.spec.js | Week Days validation | Timesheet week starts on Monday and ends on Sunday |
| utils.spec.js | Return Two Numbers | Helper function returns the sum of two numbers |

Every test is independent: it logs in on its own, so one failing test does not affect the others.

## Project structure

```
├── pages/                 # Page Objects: locators and methods for each page
│   ├── LoginPage.js
│   ├── HomePage.js        # Dashboard
│   ├── Admin.js           # Admin > System Users
│   └── TimePage.js        # Time > Employee Timesheets
├── tests/                 # Tests, one file per application area
│   ├── login.spec.js
│   ├── dashboard.spec.js
│   ├── admin.spec.js
│   ├── time.spec.js
│   └── utils.spec.js      # Tests for helper functions
├── utils/
│   └── functions.js       # Helper functions (test data generation)
├── .github/workflows/
│   └── playwright.yml     # CI: runs the tests on every push
├── .env.example           # Template for the .env file with credentials
└── playwright.config.js   # Playwright settings; loads the .env file
```

## How to run

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install                     # install dependencies
npx playwright install chromium # install the browser
cp .env.example .env            # create the .env file
```

Open the `.env` file and fill in `ADMIN_USERNAME` and `ADMIN_PASSWORD`. The demo credentials are shown on the [OrangeHRM demo login page](https://opensource-demo.orangehrmlive.com). Then run the tests:

```bash
npx playwright test             # run all tests
```

### Useful commands

| What you need | Command |
|---|---|
| Run all tests | `npx playwright test` |
| Run all tests with the browser visible | `npx playwright test --headed` |
| Run one file | `npx playwright test tests/admin.spec.js` |
| Run one file with the browser visible | `npx playwright test tests/admin.spec.js --headed` |
| Run one test by name | `npx playwright test -g "Delete Selected"` |
| Run tests step by step in UI mode | `npx playwright test --ui` |
| Open the HTML report | `npx playwright show-report` |

Each test file has a ready-to-copy command under every test to run that test on its own. Each page file has the command next to every method, to run the tests that use it.

## CI

Tests run automatically in GitHub Actions on every push and pull request to `main`. They can also be started manually from the **Actions** tab. The HTML report is saved as a build artifact.

In CI, the credentials come from **GitHub Secrets** (`ADMIN_USERNAME` and `ADMIN_PASSWORD` in Settings > Secrets and variables > Actions).

## Notes

- Tests run against a **public demo site** shared by many users, so its data changes constantly. That is why tests check rules (for example, "at least one record", "all usernames are unique") rather than exact numbers of records.
- The "Add User All" test creates a new user with a random username on every run.
- Credentials are never written in the code. Locally they are stored in a `.env` file, which is in `.gitignore`. In CI they come from GitHub Secrets.
