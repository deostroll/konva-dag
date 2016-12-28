(function(window) {

  function extend(a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  }

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
    this.toArray = function() {
      return [from, to];
    };
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
      var _in = this.in,
        _out = this.out;
      var edges = [];
      var current = this.id;
      _in.forEach(n => {
        var idx = dag.iCache[n.value];
        edges.push([idx, current]);
      });
      _out.forEach(n => {
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
    var result = [];
    var visit = function(node, parent) {
      console.log('Visiting:', node.value, 'From:', parent ? parent.value :
        '-NA-');
      var children = node.getAllNodes();
      for (var i = 0, j = children.length; i < j; i++) {
        var child = children[i];
        if (child !== parent) {
          var idx = self.iCache[child.value];
          if (visit.visited[idx] === false) {
            visit.stack.push(child);
            visit.visited[idx] = true;
            visit(child, node);
            visit.stack.pop();
          } else {
            // result.push(visit.stack.slice())
            if (parent) {
              console.log(visit.stack.toString());
              result.push(visit.stack.slice());
            }
          } // if-else end //if (visit.visited[idx] === false) {
        }
      } //end for
    };

    visit.stack = [];
    visit.visited = nodes.map(f => false);

    for (var i = 0; i < nodes.length; i++) {
      if (visit.visited[i] === false) {
        var node = nodes[i];
        visit.stack.push(node);
        visit.visited[i] = true;
        visit(node);
        visit.stack.pop();
      }
    }

    return result;
  }; //end dag.prototype.getCycles

  dag.prototype.indexOf = function(value) {
    return this.nodes.map(n => n.value).indexOf(value);
  };

  if (typeof window !== 'undefined' && window === this) {
    window.Dag = dag;
  } else if (typeof module === 'object' && module && typeof module.exports ===
    'object' && module.exports) {
    module.exports = {
      Dag: dag
    };
  }
})(this);
