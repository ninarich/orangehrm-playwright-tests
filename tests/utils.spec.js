// Tests for the helper functions in utils/functions.js (no browser needed).

const { test, expect } = require("@playwright/test");
import { returnTwoNumbers } from "../utils/functions.js";

// The returnTwoNumbers function adds two numbers
test("Return Two Numbers", async () => {
  let result = returnTwoNumbers(1, 2);
  console.log(result);
  await expect(result).toBe(3);
});
// Run this test: npx playwright test tests/utils.spec.js -g "Return Two Numbers"

// Run all tests in this file: npx playwright test tests/utils.spec.js
// Run all tests in the project: npx playwright test