window.addEventListener('load', function() {
  var container = document.getElementById('container');
  var stage = new Konva.Stage({
    height: 300,
    width: 400,
    container: container
  });
  var layer = new Konva.Layer();
  var rect = new Konva.Rect({
    height: 300,
    width: 400,
    stroke: 'black'
  });
  layer.add(rect);
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
    [2, 5],
    [2, 6],
    [3, 4],
    [3, 5],
    [4, 5]
  ].forEach(edg => dag.connect(edg[0], edg[1]));

  console.log('Nodes:', dag.toString());
  console.log('Edges:', dag.getEdges().toString());
  var kdag = new Konva.Dag(dag, {
    c: {
      fill: 'lightgreen',
      radius: 15
    },
    t: {
      fontSize: 12,
      fill: 'black'
    }
  });

  // layer.add(dag);
  var env = kdag.getEnvelope();
  env.position({
    x: stage.width() / 2,
    y: stage.height() / 2
  });
  var envRect = env.getClientRect();
  var arr = dag.getCycles();
  console.log('Cycles:', arr);
  layer.add(env);
  stage.add(layer);
}, false);
