// Utils
const sumTotal = (sum, next) => sum + next;
const descBy = (getValue) => (one, two) => {
  return getValue(two) - getValue(one);
}
console.assert([2, 1, 3].sort(descBy(n => n)).join('') === '321', "descBy test");
console.assert([2, 1, 3].map(x => ({ x })).sort(descBy(e => e.x)).map(e => e.x).join('') === '321', "descBy test");

// Data
function getData(inputStr, debug = () => {}) {
  // Data model
  function node(name, parent = undefined) {
    return {
      name,
      parent,
      depth: parent ? parent.depth + 1 : 0,
      files: [],
      dirs: [],
      size: 0, // size of all contents
      sizeOfDirectFiles: 0, // size of files excluding those in sub-directories
    };
  }
  const root = node('filesystem');
  let current = root;
  const allDirs = [];

  trackDir('/');

  // Populating the data model
  function goUp() {
    debug(`GO UP`, current.parent.name);
    current = current.parent;
  }
  function goInto(dirName) {
    debug(`GO INTO`, dirName);
    const dir = current.dirs.find(child => child.name === dirName)
    if (!dir) {
      throw Error(`${dirName} is not a known dir within ${current.name}`);
    } else {
      current = dir;
    }
  }
  function trackDir(dirName) {
    debug(`TRACK DIR`, dirName);
    const dir = node(dirName, current);
    allDirs.push(dir);
    current.dirs.push(dir);
  }
  function trackFile(file) {
    debug(`TRACK FILE`, file);
    current.files.push(file);
    current.sizeOfDirectFiles += file.size;
  }

  inputStr.split(`$ `).forEach((cmdAndOutput) => {
    if (cmdAndOutput === '') return;

    const [cmdAndArg, ...output] = cmdAndOutput.split('\n')
      .filter(Boolean); // Omit empty string after last linebreak

    const [cmd, arg] = cmdAndArg.split(' ');

    debug('exec', { cmd, arg }, output);

    switch (cmd) {
      case 'cd': {
        const dir = arg

        switch (dir) {
          case '..':
            goUp();
            return;
          default:
            goInto(dir);
            return;
        }
      }
      case 'ls': {
        output.map(line => {
          const [one, two] = line.split(' ');

          switch (one) {
            case 'dir':
              trackDir(two);
              return;
            default:
              trackFile({ size: Number(one), name: two });
              return;
          }
        })
        return;
      }
      default:
        throw Error(`Not supposed to reach this`);
    }
  });

  // Starting at deepest dirs, get total size
  allDirs.sort(descBy(dir => dir.depth)); // Sort in place
  allDirs.forEach(dir => {
    dir.size = dir.sizeOfDirectFiles + dir.dirs.map(sub => sub.size).reduce(sumTotal, 0)
  });

  return { root, allDirs };
}

// Logic
function getAns({ allDirs }) {
  return allDirs
    .filter(dir => dir.size < 100_000)
    .map(dir => dir.size)
    .reduce(sumTotal, 0);
}

// Execute
const fs = require('fs');

{
  // Test
  const data = getData(String(fs.readFileSync('./sample_input.txt')));
  const ans = getAns(data);
  const sizeMap = Object.fromEntries(
    data.allDirs.map(dir => [dir.name, dir.size])
  );
  console.assert(sizeMap.e === 584, 'e', sizeMap.e);
  console.assert(sizeMap.a === 94853, 'a', sizeMap.a);
  console.assert(sizeMap.d === 24933642, 'd', sizeMap.d);
  console.assert(sizeMap['/'] === 48381165, '/', sizeMap['/']);
  console.assert(ans === 95437, "sample_input test", ans);
}
{
  // Actual data
  const data = getData(String(fs.readFileSync('./input.txt')));
  const ans = getAns(data);
  console.log(`ans`, ans); // DEBUG
}
