const fs = require('fs');

const sumTotal = (sum, next) => sum + next;
const maximize = (max, next) => Math.max(max, next);
const descending = (one, two) => two - one;

const inputStr = String(fs.readFileSync('./input.txt'));

const maxThreeCarryTotal = inputStr.split(`\n\n`)
  .map(elfStr => elfStr.split(`\n`).map(Number).reduce(sumTotal, 0))
  .sort(descending)
  .slice(0, 3)
  .reduce(sumTotal, 0);

console.log(`maxThreeCarryTotal`, maxThreeCarryTotal); // DEBUG
