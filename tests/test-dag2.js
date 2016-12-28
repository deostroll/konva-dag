var Dag = require('./../app/dag').Dag;

var nodes = [0, 1, 2];
var dag = new Dag();
nodes.forEach(n => dag.create(n));

var edges = [[0,1], [1, 2], [2,0]];
edges.forEach(e => dag.connect(e[0], e[1]));

var result = dag.getCycles();
console.log(result);
