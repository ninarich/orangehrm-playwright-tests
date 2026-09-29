// Page Object for the Dashboard (the home page after login).
// It keeps the locators and methods for the dashboard widgets and the side menu search.
// The "icons" locator (dashboard widgets) is used directly in the "Quick Launch" test.

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.icons = `//div[@class='orangehrm-dashboard-widget-body']`;
    this.latestPost = `//div[@class='oxd-grid-item oxd-grid-item--gutters orangehrm-buzz-widget-card']`;
    this.myActions = `//div[@class='orangehrm-todo-list-item']`;
    this.mySearch = `(//input[@placeholder='Search'])[1]`;
    this.myMenu = `//span[@class='oxd-text oxd-text--span oxd-main-menu-item--name']`;
  }
 
  // Opens the Dashboard by its direct link.
  // Used in: tests/dashboard.spec.js -> "Home page"
  // Run: npx playwright test tests/dashboard.spec.js -g "Home page" --headed
  async gotoHomePage() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
    );
  }
  // Returns the number of posts in the "Buzz Latest Posts" widget.
  // Used in: tests/dashboard.spec.js -> "Buzz Latest Post"
  // Run: npx playwright test tests/dashboard.spec.js -g "Buzz Latest Post" --headed
  async countBuzzLatest() {
    let counter = await this.page.locator(this.latestPost);
    await counter.first().waitFor({ timeout: 10000 }); // wait until at least one post is loaded
    let counterLatest = counter.count();
    return counterLatest;
  }
  // Returns the number of items in the "My Actions" widget.
  // Used in: tests/dashboard.spec.js -> "Buzz Latest Post"
  // Run: npx playwright test tests/dashboard.spec.js -g "Buzz Latest Post" --headed
  async countMyActions() {
    let countAct = await this.page.locator(this.myActions);
    await countAct.first().waitFor({ timeout: 10000 }); // wait until at least one item is loaded
    let countAllActs = countAct.count();
    return countAllActs;
  }
  // Type every letter of the alphabet (lowercase) into the menu search
  // Check that all results contain the letter from the search field
  // Returns true if the search works for every letter, false if one item does not match.
  // Used in: tests/dashboard.spec.js -> "Search"
  // Run: npx playwright test tests/dashboard.spec.js -g "Search" --headed
  async actionSearch() {
    let searchField = await this.page.locator(this.mySearch);
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < alphabet.length; i++){
       let char = await alphabet[i]; // take the letter by its index
       console.log(char);
       await searchField.fill(char); // type the letter into the search field
        let menuList = await this.page.locator(this.myMenu); // locator for the menu items
        
        // Short pause is kept on purpose: the menu is filtered on the page right away,
        // and there is no single element we can wait for.
        await this.page.waitForTimeout(500);
 
        let menuListLength = await menuList.count(); // number of menu items
        for (let j = 0; j < menuListLength; j++) {
            let text = await menuList.nth(j).innerText(); // get the text of the item (count() gives only a number)
            text = text.toLowerCase(); 
        if (!text.includes(char.toLowerCase())) { // if the item does not contain the letter, the result is false
            return false;
        }
        }
    }
            return true;
}}

// Run all tests that use this page: npx playwright test tests/dashboard.spec.js --headed
// Run all tests in the project: npx playwright test
