(function(window) {
  function Node(value) {
    this.value = value;
    this.id = null;
    this.out = [];
    this.in = [];
  }

  function Edge(from, to) {
    this.toString = function() {
      return "(" + from + "," + to + ")";
    }
  };

  Node.prototype = {
    edgeTo: function(node) {
      this.out.push(node);
      node.in.push(this);
    },
    getAllNodes: function() {
      return this.in.concat(this.out);
    }
  };

  var dag = function() {
    this.nodes = [];
    this.edges = [];
  };

  dag.prototype.create = function(obj) {
    var node = new Node(obj);
    console.log(node.value);
    var idx = this.nodes.push(node);
    node.id = idx - 1;
  };

  dag.prototype.connect = function(from, to) {
    this.edges.push(new Edge(from, to));
    var n1 = this.nodes[from],
      n2 = this.nodes[to];
    n1.edgeTo(n2);
  };

  dag.DEGREE_SORT = function(n1, n2) {
    var d1 = n1.in.length + n1.out.length;
    var d2 = n2.in.length + n2.out.length;
    if (d1 < d2) {
      return 1;
    } else if (d1 > d2) {
      return -1;
    } else {
      return 0;
    }
  };

  dag.prototype.toString = function() {
    return this.nodes.map((n, i) => {
      return i + ":" + n.value.toString();
    }).join(', ');
  };

  dag.prototype.getEdges = function() {
    return this.edges.toString();
  };

  window.Dag = dag;

})(this);
