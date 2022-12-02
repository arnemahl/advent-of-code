const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

const mapping = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
}

const rounds = inputStr.split('\n')
  .map(round =>
    round
      .split(' ')
      .map(l => mapping[l])
      .reverse() // It's them first in the input file
  );

// Logic
const win = 6;
const tie = 3;
const loss = 0;

function outcome(me, them) {
  const ans = (3 + me - them) % 3;
  switch(ans) {
    case 1:
      return win;
    case 0:
      return tie;
    case 2:
      return loss;
    default:
      throw Error("WTF: " + ans);
  }
}

function score(me, them) {
  return me + outcome(me, them);
}

const sumTotal = (sum, next) => sum + next;

const total = rounds.map(round => score(...round)).reduce(sumTotal, 0);

console.log(`total`, total); // DEBUG