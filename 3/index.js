const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
const sacks = inputStr.split('\n')
  .map(sack => {
    const mid = sack.length / 2;
    return [
      sack.slice(0, mid),
      sack.slice(mid),
    ];
  });

// Logic
const pri = Object.fromEntries(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map((char, index) => [char, index + 1])
);

function findDuplicate(sack) {
  const [one, two] = sack;
  return one.split('').find(char => two.includes(char));
}

function getPriority(sack) {
  return pri[findDuplicate(sack)];
}

const sumTotal = (sum, next) => sum + next;

const total = sacks.map(getPriority).reduce(sumTotal, 0);

console.log(`total`, total); // DEBUG