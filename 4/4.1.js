const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
const pairs = inputStr.split('\n')
  .map(
    row => row.split(',')
      .map(elf => elf.split('-').map(Number)
    )
  );

// console.log(`pairs`, pairs); // DEBUG

// Logic
function isContaineDir(one, two) {
  return one[0] <= two[0] && two[0] <= one[1]
      || one[0] <= two[1] && two[1] <= one[1]
      || two[0] <= one[0] && one[0] <= two[1]
      || two[0] <= one[1] && one[1] <= two[1];
}

function isSomeContained(one, two) {
  return isContaineDir(one, two) || isContaineDir(two, one);
}

console.log(`isSomeContained( [ 2, 8 ], [ 3, 7 ])`, isSomeContained([ 2, 8 ], [ 3, 7 ])); // DEBUG

const ans = pairs.map((pair) => isContaineDir(pair[0], pair[1])).filter(Boolean).length;

console.log(`ans`, ans); // DEBUG
