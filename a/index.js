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
        addLog(); cycle++;
        break;
      case 'addx': {
        addLog(); cycle++;
        addLog(); cycle++;
        X += arg;
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

function getAnswerTask2(instructions) {
  const log = getLog(instructions);

  return log
    .map(({ cycle, X }, index) => {
      const cX = index % 40;
      const linebreak = (index !== 0 && cX === 0) ? '\n' : '';
      const onOrOff = Math.abs(cX - X) < 2 ? '#' : '.';
      return linebreak + onOrOff;
    })
    .join('');
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

function task_2_test() {
  const data = getData(String(fs.readFileSync('./sample_input_2.txt')));
  const ans = getAnswerTask2(data);

  const expected = String(fs.readFileSync('./sample_output_2_2.txt'));

  console.assert(ans === expected, `Task 2 ans wrong:`, '\n' + ans);
}

function task_1() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAnswer(data);

  console.log(`Task 1:`, ans);
}

function task_2() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAnswerTask2(data);

  console.log(`Task 2:\n`, ans);
}

{
  task_1_test_2();
  task_2_test();
  task_1();
  task_2();
}