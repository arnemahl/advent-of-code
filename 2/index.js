const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
const win = 6;
const tie = 3;
const loss = 0;

const mapping = {
  A: 1,
  B: 2,
  C: 3,
  X: loss,
  Y: tie,
  Z: win,
}

const rounds = inputStr.split('\n')
  .map(round =>
    round
      .split(' ')
      .map(l => mapping[l])
  );

// Logic
function getOutcome(me, them) {
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

const beats = {
  1: 2,
  2: 3,
  3: 1,
}
const losesTo = {
  1: 3,
  2: 1,
  3: 2,
}
function whatShouldIPick(desiredOutcome, them) {
  switch (desiredOutcome) {
    case win:
      return beats[them];
    case tie:
      return them;
    case loss:
      return losesTo[them];
  }
}

function getScore(them, desiredOutcome) {
  const me = whatShouldIPick(desiredOutcome, them);
  const outcome = getOutcome(me, them);

  if (outcome !== desiredOutcome) {
    throw Error(`Wanted ${desiredOutcome} but got ${outcome}`);
  } else {
    // console.log(`outcome`, outcome); // DEBUG
    // console.log(`score`, me + outcome); // DEBUG
  }

  return me + outcome;
}

const sumTotal = (sum, next) => sum + next;

const total = rounds.map(([them, outcome]) => getScore(them, outcome)).reduce(sumTotal, 0);

console.log(`total`, total); // DEBUG