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
  Array.from({
    length: 6
  }).forEach((_, x) => dag.create(x));
  var edges = [
    [1, 0],
    [3, 1],
    [3, 2],
    [5, 2],
    [5, 4],
    [5, 0]
  ];
  edges.forEach(edg => dag.connect(edg[0], edg[1]));
  console.log('Nodes:', dag.toString());
  console.log('Edges:', dag.getEdges().toString());
  var dag = new Konva.Dag(dag, {
    c: {
      fill: 'lightgreen',
      radius: 15
    }
  });
  var dagRect = dag.getClientRect();
  console.log('Dag Rect:', dagRect);
  dag.offset({
    x: dagRect.width/2,
    y: dagRect.height/2
  });
  dag.position({
    x: 200, y: 150
  });
  
  layer.add(dag);
  stage.add(layer);
}, false);
