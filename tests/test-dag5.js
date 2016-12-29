var Dag = require('./../app/dag').Dag;
var dag = new Dag();

var data = {
  v: [0,1,2,3,4,5,6],
  e: [
    [0,1],
    [0,5],
    [1,2],
    [2,6],
    [2,3],
    [2,5],
    [3,4],
    [4,5]
  ]
};

data.v.forEach( v => dag.create(v));
data.e.forEach( e=> {
  let [from, to] = e;
  dag.connect(from, to);
});

var cycles = dag.getCycles();
console.log(cycles.map(c => "("+ c.toString() +")").toString());
