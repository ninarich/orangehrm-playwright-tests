// Page Object for Time > Employee Timesheets.
// It keeps the locators and methods for the timesheet form and the timesheet table.

exports.TimePage = class TimePage {
  constructor(page) {
    this.page = page;
    this.viewButton = `(//button[@type='submit'])[1]`;
    this.required = `(//span[@class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message'])[1]`;
    this.viewActionButton = `(//button[@type='button'][normalize-space()='View'])[1]`;
    this.weekDays = `//th/span[2]`;
  }

  // Opens the Employee Timesheets page.
  // Used in: all tests in tests/time.spec.js
  // Run: npx playwright test tests/time.spec.js --headed
  async gotoTimePage() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/time/viewEmployeeTimesheet",
    );
    // Wait until the View button is on the page
    await this.page.locator(this.viewButton).waitFor();
  }

  // Clicks View without an employee name and checks the "Required" message.
  // Returns true if the message is visible.
  // Used in: tests/time.spec.js -> "Time Page validation"
  // Run: npx playwright test tests/time.spec.js -g "Time Page validation" --headed
  async validationTP() {
    // View button
    let viewButton = await this.page.locator(this.viewButton);
    await viewButton.click();
    // After clicking View, the "Required" message should appear (wait max 10 seconds)
    let required = await this.page.locator(this.required);
    await required.waitFor({ timeout: 10000 });
    let requiredVisible = await required.isVisible(); // check that the "Required" message is really visible on the page
    if (!requiredVisible) {
      return false;
    } else {
      return true;
    }
  }

  // validation weeks days
  // Opens the first timesheet and reads the days of the week from the table header.
  // Returns the first day (monday) and the last day (sunday).
  // Used in: tests/time.spec.js -> "Week Days validation"
  // Run: npx playwright test tests/time.spec.js -g "Week Days validation" --headed
  async validationDW() {
    let viewActionButton = await this.page.locator(this.viewActionButton);
    await viewActionButton.click();
    // Check that the week starts on Monday and ends on Sunday

    let weekDays = await this.page.locator(this.weekDays);
    await weekDays.first().waitFor({ timeout: 10000 }); // wait until the timesheet table is loaded
    let count = await weekDays.count(); 
    let weekDaysbox = [];
    for (let i = 0; i < count; i++) {
      let text = await weekDays.nth(i).innerText(); 
      weekDaysbox.push(text); 
    }
return {
    monday: weekDaysbox[0],  
    sunday: weekDaysbox[6]   
}
  }
};

// Run all tests that use this page: npx playwright test tests/time.spec.js --headed
// Run all tests in the project: npx playwright test
