// Tests for the Login page.
// The username and password are not written in the code.
// They come from environment variables: the .env file on your computer
// and GitHub Secrets in GitHub Actions (see .env.example and README.md).
// Every test logs in by itself, so each test is independent.

const { test, expect } = require("@playwright/test");
import { LoginPage } from "../pages/LoginPage.js";

// Log in as Admin: the Dashboard page should open
test("Login", async ({ page }) => {
  // Create a new instance of the LoginPage class and log in
  const login = new LoginPage(page); //create new instance
  await login.gotoLoginPage();
  await login.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await expect(page).toHaveURL(/dashboard/);
});
// Run this test: npx playwright test tests/login.spec.js -g "Login" --headed

// Run all tests in this file: npx playwright test tests/login.spec.js --headed
// Run all tests in the project: npx playwright test