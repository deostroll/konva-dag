(function(window) {

  var logFlag = false;
  function debug() {
    if (logFlag) {
      console.log.apply(console, arguments);
    }
  }

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
    Object.defineProperty(this, '_debug', {
      get: function() { return logFlag; },
      set: function(value) { logFlag = value; }
    })
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
      visit.level++;
      debug('Level:', visit.level, 'Visiting:', node.value,
        'From:', parent ? parent.value : 'null');
      var children = node.getAllNodes();
      debug('Level:', visit.level, 'Children:', children.toString());
      for (var i = 0, j = children.length; i < j; i++) {
        var child = children[i];
        debug('Level:', visit.level, 'Processing child:', child.value, 'Of node:', node.value, 'Parent:', parent ? parent.value : 'null');
        if (child !== parent) {
          var idx = self.iCache[child.value];
          if (visit.visited[idx] === 0) {
            visit.stack.push(idx);
            visit.visited[idx] = 1;
            visit(child, node);
            visit.stack.pop();
          } else {
            // result.push(visit.stack.slice())
            if (parent) {
              var cycle = [];
              var stack = visit.stack.slice();
              var k;
              while ( typeof (k = stack.pop()) !== 'undefined' && k !== idx) {
                cycle.unshift(k);
              }
              if (typeof k !== 'undefined') {
                debug('Level:', visit.level, 'Cycle:', cycle.toString());
                cycle.unshift(k);
                result.push(cycle);
              }
            }
          } // if-else end //if (visit.visited[idx] === false)
        }
        debug('Level:', visit.level, 'Done processing child:', child.value, 'Of node:', node.value, 'Parent:', parent ? parent.value : 'null');
      } //end for
      visit.level--;
    };

    visit.stack = [];
    visit.visited = nodes.map(f => 0);
    visit.level = 0;
    for (var i = 0; i < nodes.length; i++) {
      if (visit.visited[i] === 0) {
        var node = nodes[i];
        visit.stack.push(i);
        visit.visited[i] = 1;
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
