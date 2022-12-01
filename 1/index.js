const fs = require('fs');

const sumTotal = (sum, next) => sum + next;
const maximize = (max, next) => Math.max(max, next);

const inputStr = String(fs.readFileSync('./input.txt'));

const maxCarried = inputStr.split(`\n\n`)
  .map(elfStr => elfStr.split(`\n`).map(Number).reduce(sumTotal, 0))
  .reduce(maximize);

console.log(`maxCarried`, maxCarried); // DEBUG
