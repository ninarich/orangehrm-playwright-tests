// Helper functions that can be used in tests (test data generation and simple examples).
import { faker } from '@faker-js/faker';
const Chance = require('chance'); // require = import
var chance = new Chance();



// Learning example: prints a message to the console. Not used in the tests.
export function foo(){
   console.log("Hello world");
}

// Returns a random username (faker library). Not used in the tests yet.
export function fakerUser(){
return faker.internet.username()
}

// Returns a random name (chance library). Not used in the tests yet.
export function chanceUsername(){
return chance.name();
}

// Returns the sum of two numbers.
// Used in: tests/utils.spec.js -> "Return Two Numbers"
// Run: npx playwright test tests/utils.spec.js -g "Return Two Numbers"
export function returnTwoNumbers(a, b){
return a + b;
}

// Run the tests for these helpers: npx playwright test tests/utils.spec.js
// Run all tests in the project: npx playwright test
