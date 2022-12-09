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

let visualize = false; // false | 1 | 2

function logMap(path, rope) {
  function getSize() {
    switch (visualize) {
      case 1:
        return [6, 5];
      case 2:
        return [26, 21];
    }
  }
  const [xs, ys] = getSize();

  const map = Array(ys).fill().map((_, y) => {
    return Array(xs).fill().map((_, x) => '.');
  });
  const draw = (char) => ([x, y]) => map[y][x] = char;

  path.forEach(draw('#'));
  rope.slice(1).reverse().map((tail, index) => {
    const number = rope.length - index - 1;
    draw(number)(tail);
  })
  draw('H')(rope[0]);

  console.log(`\n` + map.reverse().map(line => line.join('')).join('\n'));
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getAnswerTask1(moves, nofKnots = 2, start = [0, 0]) {
  if (nofKnots < 2) throw Error('Nope!');

  let rope = Array(nofKnots).fill(start);
  const getHead = () => rope[0];
  const getTail = () => rope.slice(-1)[0];
  const path = [getTail()];

  if (visualize) {
    logMap(path, rope);
    await wait(1000);
  }

  for (let move of moves) {
    const head = vec.add(getHead(), move);
    let prevKnot = head;

    const tails = rope.slice(1).map((knot, index) => {
      // return new pos AND assign it to prevKnot
      return prevKnot = followHead(prevKnot, knot);
    });

    rope = [head, ...tails];
    path.push(getTail());

    if (visualize) {
      await wait(75);
      logMap(path, rope);
    }
  }
  if (visualize) {
    await wait(1000);
  }

  return path.map(pos => pos.join()).filter(unique).length;
}

// Execute
const fs = require('fs');

// 9.1
async function task1_test() {
  visualize = 1;
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = await getAnswerTask1(data);
  visualize = false;

  console.assert(ans === 13, 'Task 1', ans);
}

async function task1() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = await getAnswerTask1(data);

  console.log(`Task 1:`, ans);
}

// 9.2
async function task2_test1() {
  visualize = 1;
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = await getAnswerTask1(data, 10);
  visualize = false;

  console.assert(ans === 13, 'Task 2 ex 1', ans);
}
async function task2_test2() {
  visualize = 2;
  const data = getData(String(fs.readFileSync('./sample_input_2.txt')));
  const ans = await getAnswerTask1(data, 10, [11, 5]);
  visualize = false;

  console.assert(ans === 36, 'Task 2 ex 2', ans);
}

async function task2() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = await getAnswerTask1(data, 10);

  console.log(`Task 2:`, ans);
}

// Choose which to run
(async () => {
  await task1_test();
  await task2_test1();
  await task2_test2();

  await task1();
  await task2();
})();
