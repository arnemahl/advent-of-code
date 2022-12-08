// Utils
const maximize = (max, next) => Math.max(max, next);
const unique = (item, index, array) => array.indexOf(item) === index;
const descending = (one, two) => two - one;
const multiply = (product, next) => product * next;

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
function isVisibleFromEdge(tree, index, line) {
  const maxBefore = line.slice(0, index)
    .map(tree => tree.height)
    .reduce(maximize, -1);

  return tree.height > maxBefore;
}

{
  // Test isVisibleFromEdge
  const line = [{ height: 0 }, { height: 1 }, { height: 1 }];

  console.assert(isVisibleFromEdge(line[0], 0, line) === true, "Can see line[0]");
  console.assert(isVisibleFromEdge(line[1], 1, line) === true, "Can see line[1]");
  console.assert(isVisibleFromEdge(line[2], 2, line) === false, "Can't see line[2]");
  console.assert(line.filter(isVisibleFromEdge).length === 2, 'Should see two');
}

function getAnsTask1({ rows, columns }) {
  const visibleTrees = [];

  function addVisibleTrees(line) {
    visibleTrees.push(...line.filter(isVisibleFromEdge));
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


const isVisibleFromTree = (fromTree) => (tree, index, line) => {
  if (index === 0) {
    // The elves can always see the tree next to the one their treehous is in
    return true;
  }

  const tallestTreeBetween = line.slice(0, index)
    .map(tree => tree.height)
    .reduce(maximize, -1);

  // > stop if you reach (an edge or) at the first tree that is the same
  // > height or taller than the tree under consideration
  if (tallestTreeBetween >= fromTree.height) {
    return false;
  }

  return true;
}
function countVisible(tree, line) {
  return line.filter(isVisibleFromTree(tree)).length;
}
const getLinesOfSight = ({ rows, columns, trees }) => (tree) => {
  const row = rows[tree.y];
  const column = columns[tree.x];

  return [
    countVisible(tree, column.slice(0, tree.y).reverse()), // up
    countVisible(tree, row.slice(0, tree.x).reverse()), // left
    countVisible(tree, row.slice(tree.x + 1)), // right
    countVisible(tree, column.slice(tree.y + 1)), // down
  ];
}
const toScenicScore = (data) => (tree) => {
  return getLinesOfSight(data)(tree).reduce(multiply, 1);
}
function getAnsTask2(data) {
  return data.trees.map(toScenicScore(data)).reduce(maximize, 0);
}

// Execute
const fs = require('fs');

{
  // Test data
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  console.assert(data.columns[3][1] === data.rows[1][3], "foo");
  console.assert(data.columns[3][1].height === 1, "(3,1) is 1 tall");
}

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

// Task 2
{
  // Test
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = getAnsTask2(data);
  console.assert(ans === 8, "ans", ans);

  {
    console.group("Tree (2,1) test")
    const tree = data.columns[2][1];
    const score = toScenicScore(data)(tree);
    console.assert(score === 4, "scenic score", score);

    const linesOfSight = getLinesOfSight(data)(tree).join('');
    console.assert(linesOfSight === "1122", "lines of sight", linesOfSight);

    // Make sure we're testing the correct tree
    console.assert(tree.height === 5, "height", tree);

    const row = data.rows[tree.y];
    const column = data.columns[tree.x];
    const heights = (line) => line.map(tree => tree.height).join('');
    console.assert(heights(row) === "25512", "row");
    console.assert(heights(column) === "35353", "column");
    console.groupEnd();
  }
  {
    console.group("Tree (2,3) test")
    const tree = data.columns[2][3];
    const score = toScenicScore(data)(tree);
    console.assert(score === 8, "scenic score", score);

    const linesOfSight = getLinesOfSight(data)(tree).join('');
    console.assert(linesOfSight === "2221", "lines of sight", linesOfSight);

    // Make sure we're testing the correct tree
    console.assert(tree.height === 5, "height", tree);

    const row = data.rows[tree.y];
    const column = data.columns[tree.x];
    const heights = (line) => line.map(tree => tree.height).join('');
    console.assert(heights(row) === "33549", "row");
    console.assert(heights(column) === "35353", "column");
    console.groupEnd();
  }
}
{
  // Real
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAnsTask2(data);
  console.log(`ans`, ans);
}
