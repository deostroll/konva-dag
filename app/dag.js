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
    };
    this.toArray = function() { return [from, to]; };
  };

  Node.prototype = {
    edgeTo: function(node) {
      this.out.push(node);
      node.in.push(this);
    },
    getAllNodes: function() {
      return this.in.concat(this.out);
    },
    toString: function() {
      var args = Array.from(arguments);
      if (args.length === 0) {
        return this.value.toString();
      } else {
        var fn = args[0];
        return fn(this);
      }
    },
    getEdges: function() {
      var self = this;
      var dag = self._dag;
      var _in = this.in, _out = this.out;
      var edges = [];
      var current = this.id;
      _in.forEach(n => {
        var idx = dag.iCache[n.value];
        edges.push([idx, current]);
      });
      _out.forEach(n=> {
        var idx = dag.iCache[n.value];
        edges.push([current, idx])
      });
      return edges;
    }
  };

  Node.STRING_DEGREE = function(n) {
    return n.value + ":" + (n.in.length + n.out.length);
  };

  var dag = function() {
    this.nodes = [];
    this.edges = [];
    this.iCache = {};
  };

  dag.prototype.create = function(obj) {
    var node = new Node(obj);
    // console.log(node.value);
    var idx = this.nodes.push(node);
    node.id = idx - 1;
    this.iCache[node.value] = node.id;
    node._dag = this;
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

  dag.prototype.getCycles = function() {
    var self = this;
    var nodes = this.nodes;

    nodes.forEach(function(node, current){
      var edges = node.getEdges();
      var len = edges.length;
      var outer, inner;
      if (len > 1) {
        for (var i = 0; i < len; i++) {
          outer = edges[i];
          for (var j = i + 1; j < len; j++) {
            inner = edges[j];
            var [n1, n2] = _getEdgeNodes(outer, inner, current);
            if (_isConnected(n1, n2)) {
              console.log('Cycle:' [node, n1, n2].toString());
            }            
          }//end inner loop
        }//end outer loop
      }
    });

    function _isConnected(n1, n2) {
      return n1.getAllNodes().indexOf(n2) > -1;
    }

    function _getEdgeNodes(e1, e2, current) {
      var node1, node2;
      if (e1[0] !== current) {
        node1 = nodes[e1[0]];
      }
      else {
        node1 = nodes[e1[1]]
      }

      if (e2[0] !== current) {
        node2 = nodes[e2[0]];
      }
      else {
        node2 = nodes[e2[1]];
      }
      return [node1, node2];
    }

  };//end dag.prototype.getCycles

  dag.prototype.indexOf = function(value) {
    return this.nodes.map(n => n.value).indexOf(value);
  };

  if (typeof window !== 'undefined' && window === this) {
    window.Dag = dag;
  }
  else if (typeof module === 'object' && module && typeof module.exports === 'object' && module.exports) {
    module.exports = {
      Dag: dag
    };
  }
})(this);
