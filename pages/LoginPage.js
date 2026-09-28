// Page Object for the OrangeHRM Login page.
// It keeps the locators (how to find elements on the page)
// and the methods (actions on the page) in one place.
// Every UI test uses this page to log in before the test starts.

exports.LoginPage = class LoginPage {
    constructor(page){
        this.page = page;
        this.usernameInput = '//input[@name="username"]';
        this.passwordInput = '//input[@name="password"]';
        this.loginButton = "button";
    }

    // Opens the Login page.
    // Used in: all UI tests (every test logs in first).
    // Run the login test: npx playwright test tests/login.spec.js -g "Login" --headed
    async gotoLoginPage(){
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    }

    // Fills in the username and password and clicks the Login button.
    // The tests pass the values from process.env (the .env file locally, GitHub Secrets in CI),
    // so the password is never written in the code.
    // Used in: all UI tests.
    // Run the login test: npx playwright test tests/login.spec.js -g "Login" --headed
    async login(username, password){
        await this.page.locator(this.usernameInput).fill(username);
        await this.page.locator(this.passwordInput).fill(password);
        await this.page.locator(this.loginButton).click();
    }

}

// Run the login test: npx playwright test tests/login.spec.js --headed
// This page is used by all UI tests. Run all tests in the project: npx playwright test
