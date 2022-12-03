const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
const groups = inputStr.split('\n')
  .reduce((groups, sack, index) => {
    if (index % 3 === 0) {
      return groups.concat({ sacks: [sack] });
    } else {
      groups.slice(-1)[0].sacks.push(sack);
      return groups;
    }
  }, []);

// Logic
const pri = Object.fromEntries(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map((char, index) => [char, index + 1])
);

function findDuplicate(group) {
  const [one, two, three] = group.sacks;
  return one.split('').find(char => two.includes(char) && three.includes(char));
}

function getPriority(group) {
  return pri[findDuplicate(group)];
}

const sumTotal = (sum, next) => sum + next;

const total = groups.map(getPriority).reduce(sumTotal, 0);

console.log(`total`, total); // DEBUG
