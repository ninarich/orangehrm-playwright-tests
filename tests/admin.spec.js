// Tests for Admin > System Users: the users table, search and the Add User form.
// The username and password are not written in the code.
// They come from environment variables: the .env file on your computer
// and GitHub Secrets in GitHub Actions (see .env.example and README.md).
// The login is in test.beforeEach below, so each test is independent.

const { test, expect } = require("@playwright/test");
import { LoginPage } from "../pages/LoginPage.js";
import { Admin } from "../pages/Admin.js";

// Runs before every test in this file: opens the Login page and logs in as Admin.
// The login is written only once here, but it still runs before each test,
// so every test starts in a new browser and stays independent.
test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await page.waitForURL(/dashboard/); // wait until the Dashboard is open after login
});

// The Admin top menu has 7 links
test("Admin Count Links", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let links = await adminPath.countAdminLinks();
  await expect(links === 7).toBeTruthy();
  console.log(links);
});
// Run this test: npx playwright test tests/admin.spec.js -g "Admin Count Links" --headed

// Every value in the Status column is "Enabled" or "Disabled"
test("Enabled or Disabled", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let status = await adminPath.columnAdminStatus();
  console.log(status);
  await expect(status).toBeTruthy();
});
// Run this test: npx playwright test tests/admin.spec.js -g "Enabled or Disabled" --headed

// The Status column has at least one record
test("Username more than one", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let statusesTwo = await adminPath.columnStatusValueCompare();
  await expect(statusesTwo).toBeGreaterThan(0);
  console.log(statusesTwo);
});
// Run this test: npx playwright test tests/admin.spec.js -g "Username more than one" --headed

// Take the last user from the table, search for it and compare with the search result
test("Username comparison", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let usernameComparison = await adminPath.checkLastUsername();
  await expect(usernameComparison).toBeTruthy();
});
// Run this test: npx playwright test tests/admin.spec.js -g "Username comparison" --headed

// Select users with checkboxes: the "Delete Selected" button should appear
test("Delete Selected", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let result = await adminPath.checkDeleteSelect();
  await expect(result).toBeTruthy();
  console.log(result);
});
// Run this test: npx playwright test tests/admin.spec.js -g "Delete Selected" --headed

// Create a new user and find it by search
test("Add User All", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let addAllForm = await adminPath.addUserAll();
  await expect(addAllForm).toBeTruthy();
});
// Run this test: npx playwright test tests/admin.spec.js -g "Add User All" --headed

// The users table has 6 columns
test("Admin count columns", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let columns = await adminPath.countAdminColumns();
  console.log(columns);
  await expect(columns).toEqual(6);
});
// Run this test: npx playwright test tests/admin.spec.js -g "Admin count columns" --headed

// All usernames in the Username column are unique (no duplicates)
test("array username", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let usernames = await adminPath.getOfUsernames();
  console.log(usernames);
  await expect(usernames.length).toBeGreaterThan(0);

  let uniqueUsernames = new Set(usernames);
  await expect(uniqueUsernames.size).toBe(usernames.length);
});
// Run this test: npx playwright test tests/admin.spec.js -g "array username" --headed

// Password and Confirm Password do not match: an error should appear
test("Add Password", async ({ page }) => {
  const adminPath = new Admin(page);
  await adminPath.gotoAdmin();

  let passwordResult = await adminPath.addUserPassword();
  await expect(passwordResult).toBeTruthy();
});
// Run this test: npx playwright test tests/admin.spec.js -g "Add Password" --headed

// Run all tests in this file: npx playwright test tests/admin.spec.js --headed
// Run all tests in the project: npx playwright test