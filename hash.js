const SHA256 = require('crypto-js/sha256');

console.log(SHA256('This creates one hash').toString());

console.log(SHA256('String number' + 2 + 'creates another hash').toString());

console.log(SHA256('Yet another').toString());
console.log(SHA256('Yet another').toString());
console.log(SHA256('Yet another').toString());
console.log(SHA256('Yet another').toString());