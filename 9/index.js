// Utils
const sumTotal = (sum, next) => sum + next;
const unique = (item, index, array) => array.indexOf(item) === index;

const vec = {
  add(one, two) {
    return [
      one[0] + two[0],
      one[1] + two[1],
    ]
  },
  subtractFrom: (one) => (two) => {
    return [
      one[0] - two[0],
      one[1] - two[1],
    ]
  },
  manhattanDistance(one, two) {
    const diff = vec.subtractFrom(one)(two);
    return diff.map(Math.abs).reduce(sumTotal);
  }
}

// Data
function getData(inputStr) {
  // Movement vectors for coordinate system where _bottom_ left is 0,0
  return inputStr.split('\n').flatMap(line => {
    const [dir, _length] = line.split(' ');
    const l = Number(_length);

    switch (dir) {
      case 'L':
        return Array(l).fill([-1, 0]);
      case 'R':
        return Array(l).fill([1, 0]);
      case 'U':
        return Array(l).fill([0, 1]);
      case 'D':
        return Array(l).fill([0, -1]);
    }
  });
}

// Logic
function followHead(head, tail) {
  const diff = vec.subtractFrom(head)(tail);
  const [dx, dy] = diff.map(Math.abs);

  if (dx <= 1 && dy <= 1) {
    // Adjacent, no need to move
    return tail;
  }

  const absMax = (max) => (n) => {
    return n >= 0
      ? Math.min(max, n)
      : Math.max(-max, n);
  }

  return vec.add(tail, diff.map(absMax(1)));
}

function logMap(path, head, tail) {
  const map = Array(5).fill().map((_, y) => {
    return Array(6).fill().map((_, x) => '.');
  });
  const draw = (char) => ([x, y]) => map[y][x] = char;

  path.forEach(draw('#'));
  draw('T')(tail);
  draw('H')(head);

  console.log(`\n` + map.reverse().map(line => line.join('')).join('\n'));
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let visualize = false;

async function getAnswerTask1(moves) {
  let head = [0, 0]; // The starting position is arbitrary, use 0,0
  let tail = head;
  const path = [tail];

  if (visualize) {
    logMap(path, head, tail);
  }

  for (let move of moves) {
    head = vec.add(head, move);
    tail = followHead(head, tail);
    path.push(tail);

    if (visualize) {
      await wait(300);
      logMap(path, head, tail);
    }
  }

  return path.map(pos => pos.join()).filter(unique).length;
}

// Execute
const fs = require('fs');

async function task1_test() {
  // visualize = true;
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = await getAnswerTask1(data);

  console.assert(ans === 13, 'Task 1', ans);
}

async function task1() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = await getAnswerTask1(data);

  console.log(`Task 1:`, ans);
}


(async () => {
  await task1_test();
  await task1();
})();
