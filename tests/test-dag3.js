var assert = require('assert');
var Dag = require('./../app/dag').Dag;

assert(Dag, 'Not defined...!');
assert(typeof Dag !== 'object', 'is object');

var dag = new Dag();
// Array.from({
//   length: 6
// }).forEach((_, x) => dag.create(x));
var nodes = [0, 1, 2, 3, 4, 5, 6];
nodes.forEach(function(n) {
  dag.create(n);
});
var edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 6],
  [3, 5],
  [3, 4],
  [4, 5],
  [2, 5],
].forEach(edg => dag.connect(edg[0], edg[1]));

console.log('Nodes:', dag.toString());
console.log('Edges:', dag.getEdges());
var cycles = dag.getCycles();
console.log('Result:', cycles.map(c => "(" + c.toString() + ")").toString());
