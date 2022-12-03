const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
const score = {
  outcome: {
    win: 6,
    tie: 3,
    loss: 0,
  },
  option: {
    rock: 1,
    paper: 2,
    scissors: 3,
  },
}

const mapping = {
  // They pick:
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  // I must get:
  X: 'loss',
  Y: 'tie',
  Z: 'win',
}

const rounds = inputStr.split('\n')
  .map(round =>
    round
      .split(' ')
      .map(l => mapping[l])
  );

// Logic
const beats = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock',
}
const losesTo = {
  paper: 'rock',
  scissors: 'paper',
  rock: 'scissors',
}
const outcome_for_a_vs_b = Object.fromEntries(
  ['rock', 'paper', 'scissors'].map(option => [
    option,
    {
      [losesTo[option]]: 'win',
      [option]: 'tie',
      [beats[option]]: 'loss',
    },
  ])
);

function getOutcomeName(me, them) {
  return outcome_for_a_vs_b[me][them];
}

function whatShouldIPick(desiredOutcome, them) {
  switch (desiredOutcome) {
    case'win':
      return beats[them];
    case'tie':
      return them;
    case'loss':
      return losesTo[them];
  }
}

function getScore(them, desiredOutcome) {
  const me = whatShouldIPick(desiredOutcome, them);

  {
    // Verify
    const outcome = getOutcomeName(me, them);

    if (outcome !== desiredOutcome) {
      throw Error(`Wanted ${desiredOutcome} but got ${outcome}. They picked ${them} and I picked ${me}`);
    }

    // Debug
    if (false) {
      console.group("round");
      console.log(`${outcome}: ${me} vs. ${them}`);
      console.log(me, score.option[me]);
      console.log(desiredOutcome, score.outcome[desiredOutcome]);
      console.log(`total:`, score.option[me] + score.outcome[desiredOutcome]);
      console.groupEnd();
    }
  }

  return score.option[me] + score.outcome[desiredOutcome];
}

const sumTotal = (sum, next) => sum + next;

const total = rounds.map(([them, outcome]) => getScore(them, outcome)).reduce(sumTotal, 0);

console.log(`total`, total); // DEBUG