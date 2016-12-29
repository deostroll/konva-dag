var Dag = require('./../app/dag').Dag;
var dag = new Dag();

var data = {
  v: [0,1,2,3,4,5,6,7,8],
  e: [
    [0,1],
    [0,3],
    [1,2],
    [2,3],
    [3,5],
    [5,4],
    [5,7],
    [4,6],
    [6,7],
    [7,8]
  ]
};

data.v.forEach( v => dag.create(v));
data.e.forEach( e=> {
  let [from, to] = e;
  dag.connect(from, to);
});

var cycles = dag.getCycles();
console.log(cycles.map(c => "("+ c.toString() +")").toString());
