// array that contains all the arguments we pass into a function
console.log(arguments); // this confirms that we are inside a function
console.log(require("module").wrapper); // reference to the wrapper function

/* module.exports */

// since it is our own module, we have to use './'
const calc = require("./test-module-1");
const calculator1 = new calc();

console.log(calculator1.add(3, 4));

/* exports */

// normal
const calculator2 = require("./test-module-2");
console.log(calculator2.add(2, 5));

// destructuring
const { add, subtract } = require("./test-module-2");
console.log(add(2, 5));

// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
