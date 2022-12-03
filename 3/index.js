const fs = require('fs');
const inputStr = String(fs.readFileSync('./sample_input.txt'));

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

console.assert(pri.p === 16, 'pri.p');
console.assert(pri.L === 38, 'pri.L');
console.assert(pri.P === 42, 'pri.P');
console.assert(pri.v === 22, 'pri.v');
console.assert(pri.t === 20, 'pri.t');
console.assert(pri.s === 19, 'pri.s');

function findDuplicate(sack) {
  const [one, two] = sack;
  return one.split('').find(char => two.includes(char));
}

['p', 'L', 'P', 'v', 't', 's'].forEach((char, index) => {
  console.assert(findDuplicate(sacks[index]) === char, `Duplicate ${char} in ${index}`);
});

function getPriority(sack) {
  return pri[findDuplicate(sack)];
}

const sumTotal = (sum, next) => sum + next;

const total = sacks.map(getPriority).reduce(sumTotal, 0);

console.assert(total === 157, "Total should be 157");

console.log(`total`, total); // DEBUG