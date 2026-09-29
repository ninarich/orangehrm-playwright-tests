// Tests for the Dashboard: widgets, menu search and the direct link.
// The username and password are not written in the code.
// They come from environment variables: the .env file on your computer
// and GitHub Secrets in GitHub Actions (see .env.example and README.md).
// The login is in test.beforeEach below, so each test is independent.

const { test, expect } = require("@playwright/test");
import { HomePage } from "../pages/HomePage.js";
import { LoginPage } from "../pages/LoginPage.js";

// Runs before every test in this file: opens the Login page and logs in as Admin.
// The login is written only once here, but it still runs before each test,
// so every test starts in a new browser and stays independent.
test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await page.waitForTimeout(4000);
});

// The Dashboard has 6 widgets
test("Quick Launch", async ({ page }) => {
  const iconsTest = new HomePage(page);
  await expect(page.locator(iconsTest.icons)).toHaveCount(6);
});
// Run this test: npx playwright test tests/dashboard.spec.js -g "Quick Launch" --headed

// The "Buzz Latest Posts" widget is not empty
// The "My Actions" widget has at least one item
test("Buzz Latest Post", async ({ page }) => {
  const iconsTest = new HomePage(page);
  await expect(page.locator(iconsTest.icons)).toHaveCount(6); // iconsTest is an instance of the HomePage class; icons is a locator from its constructor
  await page.waitForTimeout(4000);

  let counter = await iconsTest.countBuzzLatest();
  await expect(counter).toBeGreaterThan(0);
  console.log(counter);
  await page.waitForTimeout(4000);

  let actions = await iconsTest.countMyActions();
  await expect(actions).toBeGreaterThan(0);
  console.log(actions);
});
// Run this test: npx playwright test tests/dashboard.spec.js -g "Buzz Latest Post" --headed

// Type every letter a-z into the menu search and check that all results contain that letter (case-insensitive)
test("Search", async ({ page }) => {
  const hp = new HomePage(page);

  let searchResultTest = await hp.actionSearch();
  await expect(searchResultTest).toBeTruthy();
  console.log(searchResultTest);
});
// Run this test: npx playwright test tests/dashboard.spec.js -g "Search" --headed

// After login, the Dashboard opens by its direct link
test("Home page", async ({ page }) => {
  const home = new HomePage(page);
  await home.gotoHomePage();
  await expect(page).toHaveURL(/dashboard\/index/);
});
// Run this test: npx playwright test tests/dashboard.spec.js -g "Home page" --headed

// Run all tests in this file: npx playwright test tests/dashboard.spec.js --headed
// Run all tests in the project: npx playwright test