/*
 * Based on pseudocode from
 * https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
 */

// Utils
const descendingBy = (getValue) => (one, two) => {
  return getValue(two) - getValue(one);
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
module.exports = function A_Star({ start, goal, h, nodes }) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  openSet = [start];

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
  // to n currently known.
  const cameFrom = {};

  // cameFrom is used to reconstruct path once we find the best solution
  function reconstruct_path(current) {
    let backwardsPath = [];
    do {
      backwardsPath.push(current);
    } while (current = cameFrom[current.id]);
    return backwardsPath.reverse();
  }

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = Object.fromEntries(
    nodes.map(node => [node.id, Number.POSITIVE_INFINITY])
  );
  gScore[start.id] = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore = Object.fromEntries(
    nodes.map(node => [node.id, Number.POSITIVE_INFINITY])
  );
  fScore[start.id] = h(start);

  while (openSet.length > 0) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    // current := the node in openSet having the lowest fScore[] value
    const current = openSet.pop(); // Openset is sorted descending by fScore each time a node is added, can pop last

    if (current === goal) {
      return reconstruct_path(current);
    }

    for (const neighbor of current.neighbors) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      // tentative_gScore := gScore[current] + d(current, neighbor)
      const tentative_gScore = gScore[current.id] + 1; // distance from current to neighbor is always 1 in our case

      if (tentative_gScore < gScore[neighbor.id]) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[neighbor.id] = current;
        gScore[neighbor.id] = tentative_gScore;
        fScore[neighbor.id] = tentative_gScore + h(neighbor);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
          openSet.sort(descendingBy(node => fScore[node.id])); // Sort descending by fScore so last is best/lowest
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  return Number.POSITIVE_INFINITY;
}