const fs = require('fs');
const inputStr = String(fs.readFileSync('./input.txt'));

// Data
function toCargo(cargoStr) {
  const [indices, ...contents] = cargoStr.split('\n').reverse();

  const stackNumbers = indices.replace(/ /g, "").split("").map(Number);
  const stacks = Object.fromEntries(
    stackNumbers.map(stackNo => [stackNo, []])
  );

  contents.forEach((line) => {
    stackNumbers.forEach(n => {
      // n = 1, 2, ... n
      const char = line[n + 3 * (n - 1)];

      if (char !== " ") {
        stacks[n].push(char);
      }
    });
  });

  // Sample: { '1': [ 'Z', 'N' ], '2': [ 'M', 'C', 'D' ], '3': [ 'P' ] }
  return stacks;
}

function toSteps(allStepsStr) {
  return allStepsStr.split("\n")
    .map(singleStepStr => {
      const match = singleStepStr.match(/move (\d+) from (\d+) to (\d+)/);
      const [count, from, to] = match.slice(1, 4);
      return { count, from, to };
    });
}

const [cargoStr, stepsStr] = inputStr.split('\n\n');

let cargo = toCargo(cargoStr);
const steps = toSteps(stepsStr);

if (false) {
  console.group("input data");
  console.log(`cargo`, cargo); // DEBUG
  console.log(`steps`, steps); // DEBUG
  console.groupEnd();
}

// Logic
function executeStep(cargo, step) {
  const { count, from, to } = step;

  // Mutates cargo object!
  cargo[to].push(
    ...cargo[from].splice(-count)
  );

  return cargo;
}

function getTops(cargo) {
  return Object.entries(cargo)
    .map(([_, stack]) => stack.slice(-1)[0])
    .join('');
}

cargo = steps.reduce(executeStep, cargo);

if (false) {
  console.group("output data");
  console.log(`cargo`, cargo); // DEBUG
  console.groupEnd();
}

console.log(`answer`, getTops(cargo)); // DEBUG
