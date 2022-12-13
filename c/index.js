// Data
function getData(inputString) {
  function getElevation(char) {
    switch (char) {
      case 'S':
        return getElevation('a');
      case 'E':
        return getElevation('z');
      default:
        return Number.parseInt(char, 36) - 10; // [a,z] -> [0,25]
    }
  }

  let start, goal;

  function toSquare({ char, x, y }) {
    const square = {
      x,
      y,
      id: `${x},${y}`,
      elevation: getElevation(char),
    };

    if (char === 'S') {
      start = square;
    } else if (char === 'E') {
      goal = square;
    }

    return square;
  }

  const mapYX = inputString.split('\n').map((line, y) =>
    line.split('').map((char, x) => toSquare({ char, x, y }))
  );

  const squares = mapYX.flat();

  const mapXY = mapYX[0].map((_, x) => {
    return squares.filter(square => square.x === x);
  });

  const size = {
    x: mapXY.length,
    y: mapYX.length,
  }


  squares.forEach(square => {
    square.neighbors = []

    function consider(neighbor) {
      if (!neighbor) return; // Out of bounds
      if (neighbor.elevation - square.elevation > 1) return; // Too high
      square.neighbors.push(neighbor);
    }

    const { x, y } = square;

    consider(mapYX[y][x - 1]);
    consider(mapYX[y][x + 1]);
    consider(mapXY[x][y - 1]);
    consider(mapXY[x][y + 1]);
  });

  // // DEBUG
  // console.log(
  //   `map with nof possible neighbors from each square\n`
  //   + mapYX.map(line => line.map(s => s.neighbors.length).join('')).join('\n')
  // );

  return {
    start,
    goal,
    squares,
  };
}

// // Logic
const A_star = require('./A_star');

function getAns_task1({ start, goal, squares }) {
  // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
  function h(square) {
    const elevationDiff = goal.elevation - square.elevation;
    const manhattanDistance = Math.abs(goal.x - square.x)
                            + Math.abs(goal.y - square.y);

    return Math.max(elevationDiff, manhattanDistance);
  }

  const path = A_star({ start, goal, h, nodes: squares });

  // Nof steps is `path.length - 1`, since path includes the starting point,
  // but the cost to get there is 0 steps.
  return path ? path.length - 1 : undefined;
}

// Execute
const fs = require('fs');

function task_1_test() {
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = getAns_task1(data);
  console.assert(ans === 31, "Task 1 ans wrong:", ans);
}

function task_1() {
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAns_task1(data);
  console.log(`Task 1:`, ans);
}

{
  task_1_test();
  task_1();
}