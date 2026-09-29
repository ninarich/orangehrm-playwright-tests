// Tests for Time > Employee Timesheets: form validation and the week days.
// The username and password are not written in the code.
// They come from environment variables: the .env file on your computer
// and GitHub Secrets in GitHub Actions (see .env.example and README.md).
// The login is in test.beforeEach below, so each test is independent.

const { test, expect } = require("@playwright/test");
import { LoginPage } from "../pages/LoginPage.js";
import { TimePage } from "../pages/TimePage.js";

// Runs before every test in this file: opens the Login page and logs in as Admin.
// The login is written only once here, but it still runs before each test,
// so every test starts in a new browser and stays independent.
test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await page.waitForURL(/dashboard/); // wait until the Dashboard is open after login
});

// Click View without Employee Name: the "Required" message should appear
test("Time Page validation", async ({ page }) => {
  const tp = new TimePage(page); // tp = Time Page
  await tp.gotoTimePage();

  let validationEmployeeName = await tp.validationTP();
  await expect(validationEmployeeName).toBeTruthy();
});
// Run this test: npx playwright test tests/time.spec.js -g "Time Page validation" --headed

// The timesheet week starts on Monday and ends on Sunday
test("Week Days validation", async ({ page }) => {
  const tp = new TimePage(page); // tp = Time Page
  await tp.gotoTimePage();

  let validationWeekDays = await tp.validationDW();
  await expect(validationWeekDays.monday).toBe("Mon");
  await expect(validationWeekDays.sunday).toBe("Sun");
});
// Run this test: npx playwright test tests/time.spec.js -g "Week Days validation" --headed

// Run all tests in this file: npx playwright test tests/time.spec.js --headed
// Run all tests in the project: npx playwright test