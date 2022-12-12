// Utils
const sumTotal = (sum, next) => sum + next;

// Data
function getData(inputString) {
  return inputString.split('\n').map(line => {
    const [cmd, arg] = line.split(' ');
    return {
      cmd,
      arg: arg ? Number(arg) : undefined,
    }
  });
}

// Logic
function getLog(instructions) {
  let cycle = 1;
  let X = 1;
  let log = [];

  function addLog() {
    log.push({ cycle, X });
  }

  instructions.forEach(({ cmd, arg }) => {
    switch (cmd) {
      case 'noop':
        cycle++; addLog();
        break;
      case 'addx': {
        cycle++; addLog();
        X += arg;
        cycle++; addLog();
      }
    }
  });

  return log;
}

function getSignalStrenghtLog(instructions) {
  return getLog(instructions)
    .map(({ cycle, X }) => {
      const shouldCount = (cycle - 20) % 40 === 0;
      if (shouldCount) {
        return {cycle, X, signalStrength: cycle * X };
      }
    })
    .filter(Boolean);
}

function getAnswer(instructions) {
  return getSignalStrenghtLog(instructions)
    .map(entry => entry.signalStrength)
    .reduce(sumTotal, 0);
}


// Execute
const fs = require('fs');

// 10.1
function task_1_test_2() {
  const data = getData(String(fs.readFileSync('./sample_input_2.txt')));
  const ans = getAnswer(data);

  console.assert(ans === 13140, 'Task 1 ans wrong:', ans);

  const str = input => JSON.stringify(input, null, 2);
  const log = getSignalStrenghtLog(data);
  const expected = [
    { cycle: 20, X: 21, signalStrength: 420 },
    { cycle: 60, X: 19, signalStrength: 1140 },
    { cycle: 100, X: 18, signalStrength: 1800 },
    { cycle: 140, X: 21, signalStrength: 2940 },
    { cycle: 180, X: 16, signalStrength: 2880 },
    { cycle: 220, X: 18, signalStrength: 3960 },
  ];

  console.assert(str(log) === str(expected), "Task 1 log wrong:", log);
}

function task_1() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAnswer(data);

  console.log(`Task 1:`, ans);
}

{
  task_1_test_2();
  task_1();
}