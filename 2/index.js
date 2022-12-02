const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

const rpc = [1, 2, 3];

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

function test(me, them, expected) {
  const o = outcome(me, them);
  if (o !== expected) {
    console.log(`me, them`, me, them); // DEBUG
    console.log(`o`, o); // DEBUG
    throw Error(`Expected ${expected}, got ${o}`);
  }
  return o;
}

test(1,1, tie);
test(1,2, loss);
test(1,3, win);
test(2,1, win);
test(2,2, tie);
test(2,3, loss);
test(3,1, loss);
test(3,2, win);
test(3,3, tie);