// Utils
const maximize = (max, next) => Math.max(max, next);
const unique = (item, index, array) => array.indexOf(item) === index;

// Data
const id = (x, y) => `${x}:${y}`;

function getData(inputString) {
  const array2d = inputString.split('\n').map(
    (line, y) => line.split('').map(
      (height, x) => {
        return {
          id: id(x, y),
          x,
          y,
          height: Number(height),
        }
      }
    )
  );
  const trees = array2d.flat();
  const rows = array2d;
  const columns = array2d[0].map((_, x) => {
    return trees.filter(tree => tree.x === x);
  });

  return { trees, rows, columns };
}

/* Logic */
function isVisible(tree, index, line) {
  const maxBefore = line.slice(0, index)
    .map(tree => tree.height)
    .reduce(maximize, -1);

  return tree.height > maxBefore;
}

{
  // Test isVisible
  const line = [{ height: 0 }, { height: 1 }, { height: 1 }];

  console.assert(isVisible(line[0], 0, line) === true, "Can see line[0]");
  console.assert(isVisible(line[1], 1, line) === true, "Can see line[1]");
  console.assert(isVisible(line[2], 2, line) === false, "Can't see line[2]");
  console.assert(line.filter(isVisible).length === 2, 'Should see two');
}

function getAnsTask1({ rows, columns }) {
  const visibleTrees = [];

  function addVisibleTrees(line) {
    visibleTrees.push(...line.filter(isVisible));
  }

  [...rows, ...columns].forEach(line => {
    addVisibleTrees(line);
    addVisibleTrees(line.slice().reverse());
  });

  return visibleTrees
    .map(tree => tree.id)
    .filter(unique)
    .length;
}

// Execute
const fs = require('fs');

// Task 1
{
  // Test
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = getAnsTask1(data);
  console.assert(ans === 21, "ans", ans);
}
{
  // Real
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAnsTask1(data);
  console.log(`ans`, ans);
}
