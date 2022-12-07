const debug = false;

const fs = require('fs');
const inputStr = debug
  ? String(fs.readFileSync('./sample_inputs.txt')).split('\n')[4]
  : String(fs.readFileSync('./input.txt'));

// Data
const input = inputStr.split('');

// Logic
const unique = (item, index, array) => array.indexOf(item) === index;

function isAfterMarker(_, index, array) {
  return index > 14
      && array.slice(index - 14, index).every(unique);
}

const index = input.findIndex(isAfterMarker);

if (debug) {
  console.log(`marker:`, inputStr.slice(index - 14, index)); // DEBUG
}

console.log(`index`, index);
