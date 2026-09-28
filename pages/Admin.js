// Page Object for Admin > User Management > System Users.
// It keeps the locators and methods for the users table, the search form
// and the "Add User" form.
// Helper imports: faker creates random test data, functions.js has shared helper functions.

import { foo, returnTwoNumbers } from "../utils/functions.js";
import { faker } from "@faker-js/faker";
import { fakerUser } from "../utils/functions.js";
import { chanceUsername } from "../utils/functions.js";
 
const Chance = require("chance");
var chance = new Chance();
 
exports.Admin = class Admin {
  constructor(page) {
    this.page = page;
    this.adminLinks = `//nav[@aria-label="Topbar Menu"]//li`;
    this.adminColumns = `//div[@class='oxd-table-header-cell oxd-padding-cell oxd-table-th']`;
    this.columnStatus = `//div[@class="oxd-table-cell oxd-padding-cell"][5]`;
    this.columnUsername = `//div[@class="oxd-table-cell oxd-padding-cell"][2]`;
    this.lastUsername = `(//div[@role='cell'][2])[last()]`;
    this.usernameSearch = `(//input[@class='oxd-input oxd-input--active'])[2]`;
    this.searchButton = `(//button[normalize-space()='Search'])[1]`;
    this.checkboxes = `//span[@class="oxd-checkbox-input oxd-checkbox-input--active --label-right oxd-checkbox-input"]`; // )[position()>1]
    this.deleteSelectedButton = `//button[normalize-space()='Delete Selected']`;
    this.addButton = `//button[normalize-space()='Add']`;
    this.userRole = `(//div[contains(text(),'-- Select --')])[1]`;
    this.userStatus = `(//div[@class='oxd-select-wrapper'])[2]`;
    this.userEmployeeName = `//input[@placeholder='Type for hints...']`;
    this.userUsername = `(//input[@class='oxd-input oxd-input--active'])[2]`;
    this.userPassword = `(//input[@type='password'])[1]`;
    this.userConfirmPassword = `(//input[@type='password'])[2]`;
    this.saveButton = `(//button[normalize-space()='Save'])[1]`;
    this.passwordMismatchError = `//span[normalize-space()='Passwords do not match']`;
    this.userSearchResult = `(//div[@role='cell'])[2]`;
  }
  // Opens the System Users page.
  // Used in: all tests in tests/admin.spec.js
  // Run: npx playwright test tests/admin.spec.js --headed
  async gotoAdmin() {
    await this.page.waitForTimeout(4000);
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
    );
    await this.page.waitForTimeout(4000);
  }
  // Returns the number of links in the Admin top menu.
  // Used in: tests/admin.spec.js -> "Admin Count Links"
  // Run: npx playwright test tests/admin.spec.js -g "Admin Count Links" --headed
  async countAdminLinks() {
    let countLinks = this.page.locator(this.adminLinks);
    let countAllLinks = countLinks.count();
    return countAllLinks;
  }
 
  // Returns the number of columns in the users table.
  // Used in: tests/admin.spec.js -> "Admin count columns"
  // Run: npx playwright test tests/admin.spec.js -g "Admin count columns" --headed
  async countAdminColumns() {
    let countColumns = this.page.locator(this.adminColumns);
    let countAllColumns = countColumns.count();
    return countAllColumns;
  }
 
  // Returns true if every value in the Status column is "Enabled" or "Disabled".
  // Used in: tests/admin.spec.js -> "Enabled or Disabled"
  // Run: npx playwright test tests/admin.spec.js -g "Enabled or Disabled" --headed
  async columnAdminStatus() {
    let columnText = this.page.locator(this.columnStatus);
    let count = await columnText.count();
    console.log(`Elements found: ${count}`);
    for (let i = 0; i < count; i++) {
      let text = (await columnText.nth(i).innerText()) || "";
      console.log(`Text ${i + 1}: "${text}"`);
      if (!text.includes("Enabled") && !text.includes("Disabled")) {
        return false; // found a value that is neither Enabled nor Disabled
      }
    }
    return true; // all values passed the check
  }
 
  // Collects all usernames from the table and returns them as an array.
  // Used in: tests/admin.spec.js -> "array username"
  // Run: npx playwright test tests/admin.spec.js -g "array username" --headed
  async getOfUsernames() {
    let usernameText = await this.page.locator(this.columnUsername);
    let countUsername = await usernameText.count();
    console.log(countUsername);
    let allUsernames = []; // collect all usernames here
    for (let i = 0; i < countUsername; i++) {
      let textUsername = (await usernameText.nth(i).innerText()) || "";
      allUsernames.push(textUsername);
    }
    return allUsernames;
  }
 
  // Returns the number of values in the Status column (= number of users in the table).
  // Used in: tests/admin.spec.js -> "Username more than one"
  // Run: npx playwright test tests/admin.spec.js -g "Username more than one" --headed
  async columnStatusValueCompare() {
    let statuses = await this.page.locator(this.columnStatus);
    let countTwo = await statuses.count();
    console.log(`Elements found: ${countTwo}`);
    return countTwo;
  }
 
  ////////
  // Takes the last username in the table, searches for it
  // and returns true if the first search result is the same user.
  // Used in: tests/admin.spec.js -> "Username comparison"
  // Run: npx playwright test tests/admin.spec.js -g "Username comparison" --headed
  async checkLastUsername() {
    let lastUserInList = await this.page.locator(this.lastUsername);
    lastUserInList = await lastUserInList.textContent();
    console.log(lastUserInList);
    let usernameSearchField = await this.page.locator(this.usernameSearch);
    await usernameSearchField.fill(lastUserInList);
    let searchButton = await this.page.locator(this.searchButton);
    await searchButton.click();
    await this.page.waitForTimeout(3000);
    // Compare with the first search result in the table (same as in addUserAll)
    let searchResult = this.page.locator(
      `//div[@class='oxd-table-card']//div[@role='cell'][2]`,
    );
    let textUsernameSearch = await searchResult.first().innerText();
    if (!(lastUserInList.trim() === textUsernameSearch.trim())) {
      return false;
    } else {
      return true;
    }
  }
 
  // Selects the checkbox of every user (index 0 is "select all", so it is skipped)
  // and returns true if the "Delete Selected" button appears.
  // Used in: tests/admin.spec.js -> "Delete Selected"
  // Run: npx playwright test tests/admin.spec.js -g "Delete Selected" --headed
  async checkDeleteSelect() {
    let checkboxesClick = await this.page.locator(this.checkboxes);
    let count = await checkboxesClick.count();
    console.log(count);
    for (let i = 1; i < count; i++) {
      let checkbox = checkboxesClick.nth(i);
      let visible = await checkbox.isVisible();
      console.log(i, visible);
      if (visible) {
        await checkbox.click();
      }
      await this.page.waitForTimeout(500);
    }
    let buttonVisible = await this.page
      .locator(this.deleteSelectedButton)
      .isVisible();
    console.log("button visible:", buttonVisible);
    if (!buttonVisible) {
      return false;
    } else {
      return true;
    }
  }
 
  // Negative test: fills in Password and a different Confirm Password, clicks Save
  // and returns true if the "Passwords do not match" error appears.
  // Used in: tests/admin.spec.js -> "Add Password"
  // Run: npx playwright test tests/admin.spec.js -g "Add Password" --headed
  async addUserPassword() {
    let addButton = await this.page.locator(this.addButton);
    await addButton.click();
 
    let userPassword = await this.page.locator(this.userPassword);
    await userPassword.click();
    let randomPassword = faker.internet.password({ length: 7 });
    await userPassword.fill(randomPassword);
 
    // Enter a different password in Confirm Password
    let userConfirmPassword = await this.page.locator(this.userConfirmPassword);
    await userConfirmPassword.click();
    await userConfirmPassword.fill(randomPassword + "x");
 
    let saveButton = await this.page.locator(this.saveButton);
    await saveButton.click();
    await this.page.waitForTimeout(2000);
 
    // The "Passwords do not match" error should appear
    let errorVisible = await this.page.locator(this.passwordMismatchError).isVisible();
    if (!errorVisible) {
      return false;
    } else {
      return true;
    }
  }
 
  // End-to-end: creates a new user with a random username (for example "Tortik4821"),
  // then searches for this user and returns true if the search finds it.
  // Used in: tests/admin.spec.js -> "Add User All"
  // Run: npx playwright test tests/admin.spec.js -g "Add User All" --headed
  async addUserAll() {
    let addButton = await this.page.locator(this.addButton);
    await addButton.click();
    // userRole
    let userRole = await this.page.locator(this.userRole);
    await userRole.click();
    await this.page.focus(this.userRole);
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
    // userStatus
    let userStatus = await this.page.locator(this.userStatus);
    await userStatus.click();
    await this.page.focus(this.userStatus);
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
 
    let userUsername = await this.page.locator(this.userUsername);
    //const fakerUsername = faker.internet.username();
    let randomNum = Math.floor(Math.random() * 9000) + 1000;
    let userUsernameText = "Tortik" + randomNum;
    await userUsername.fill(userUsernameText);
    // await userUsername.fill(fakerUsername);
    // await userUsername.fill(fakerUser()); // https://fakerjs.dev/guide/
 
    // employeeName
    let employeeName = await this.page.locator(this.userEmployeeName);
    await employeeName.click();
    await employeeName.fill("a");
    await this.page.waitForTimeout(4000);
    await this.page.focus(this.userEmployeeName);
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
 
    //userPassword
    let userPasswordField = await this.page.locator(this.userPassword);
    await userPasswordField.click();
    let randomPassword = "A1s2d3f@g";
    //const chancePassword = faker.internet.password();
    //let randomPassword = await faker.internet.password({ length: 20 });
    //await userPassword.fill(randomPassword);
    await userPasswordField.fill(randomPassword);
 
    //userConfirmPassword
    let userConfirmPassword = await this.page.locator(this.userConfirmPassword);
    await userConfirmPassword.click();
    await userConfirmPassword.fill(randomPassword);
 
    // Save button
    let saveButton = await this.page.locator(this.saveButton);
    await saveButton.click();
 
    // Check that the new user can be found by search
    let usernameSearchCompare = this.page.locator(this.usernameSearch);
    await this.page.waitForTimeout(4000);
    await usernameSearchCompare.fill(userUsernameText); //
    console.log(`Searching for: "${userUsernameText}"`);
 
    // 2. Click the Search button
    let searchButton = this.page.locator(this.searchButton);
    await searchButton.click();
    await this.page.waitForTimeout(3000);
 
    // 3. Get the result from the table
    let userSearchResult = this.page.locator(
      `//div[@class='oxd-table-card']//div[@role='cell'][2]`,
    );
    let textUserSearchResult = await userSearchResult.first().innerText();
    console.log(`Searched for: "${userUsernameText}"`);
    console.log(`Found: "${textUserSearchResult}"`);
 
    if (!(userUsernameText === textUserSearchResult)) {
      return false;
    } else {
      return true;
    }
  }
};

// Run all tests that use this page: npx playwright test tests/admin.spec.js --headed
// Run all tests in the project: npx playwright test
