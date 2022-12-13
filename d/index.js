// Utils
const fs = require('fs');

const sumTotal = (sum, next) => sum + next;

// Data
function getPairs(inputString) {
  return inputString.split('\n\n').map(pairStr =>
    pairStr.split('\n').map(JSON.parse)
  );
}

// Logic
function sort(left, right) {
  switch ([typeof left, typeof right].join()) {
    case 'number,number':
      return left - right;
    case 'object,object': {
      const firstNonZero = left
        .map((_, i) => {
          return i in right ? sort(left[i], right[i]) : 1;
        })
        .find(n => n !== 0);
      return firstNonZero ?? 0;
    }
    case 'number,object':
      return sort([left], right);
    case 'object,number':
      return sort(left, [right]);
    default:
      throw Error(`WTF ${[typeof left, typeof right]}`);
  }
}
// // Wrapper for the actual sort function to show all the steps
// function sort(left, right) {
//   console.group(left, 'vs', right);
//   const ans = _sort(left, right);
//   console.log('sort ->', ans); // DEBUG
//   console.groupEnd();
//   return ans;
// }

function isOrdered([left, right]) {
  return sort(left, right) <= 0;
}

function getIndices(pairs) {
  return pairs
    .map((pair, index) => isOrdered(pair) ? index + 1 : 0)
    .filter(Boolean);
}

function getAns(pairs) {
  return getIndices(pairs).reduce(sumTotal, 0);
}

// Execute
{
  const pairs = getPairs(String(fs.readFileSync('./sample_input.txt')));

  function assertOrdered(value, expected) {
    const name = `isOrdered(${JSON.stringify(value)}) ->`;
    const ans = isOrdered(value);
    console.assert(ans === expected, name, ans);
  }

  assertOrdered(pairs[0], true);
  assertOrdered(pairs[1], true);
  assertOrdered(pairs[2], false);
  assertOrdered(pairs[3], true);
  assertOrdered(pairs[4], false);
  assertOrdered(pairs[5], true);
  assertOrdered(pairs[6], false);
  assertOrdered(pairs[7], false);

  console.assert(getIndices(pairs).join() === '1,2,4,6', 'getIndices(pairs)', getIndices(pairs));
  console.assert(getAns(pairs) === 13, 'getAns(pairs)', getAns(pairs));
}

{
  const pairs = getPairs(String(fs.readFileSync('./input.txt')));
  const ans = getAns(pairs);
  console.log(`Task 1:`, ans);
}
