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
    }
  };

  Node.STRING_DEGREE = function(n) {
    return n.value + ":" + (n.in.length + n.out.length);
  };

  var dag = function() {
    this.nodes = [];
    this.edges = [];
  };

  dag.prototype.create = function(obj) {
    var node = new Node(obj);
    // console.log(node.value);
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

  dag.prototype.getCycles = function() {
    var self = this;
    var edges = this.edges.reduce((cache, e) => {
      var a = e.toArray();
      a.sort();
      cache[a.join('')] = false;
      return cache;
    }, {});
    var nodes = this.nodes.slice();

    var iCache = nodes.reduce((c, n, i) => {
      c[n.value] = i;
      return c;
    }, {});

    var degSorted = nodes.sort(dag.DEGREE_SORT);
    var cycle = [];
    var result = [];

    nodes.forEach(n => _visit(n));
    return result;
    function _visit(node, parent, startIndex) {
      if (typeof parent === 'undefined') {
        cycle.push(node);
        var childs = node.getAllNodes();
        var pIndex = iCache[node.value];
        for (var i = 0; i < childs.length; i++) {
          var c = childs[i];
          var cIndex = iCache[c.value];
          var edg = _tostr(pIndex, cIndex);
          edges[edg] = true;
          cycle.push(c);
          _visit(c, edg, pIndex);
        }
      }
      else {
        var childs = node.getAllNodes();
        var pIndex = iCache[node.value];
        for (var i = 0; i < childs.length; i++) {
          var c = childs[i];
          var cIndex = iCache[c.value];
          var edg = _tostr(pIndex, cIndex);
          if (parent !== edg) {
            if (edges[edg]) {
              continue;
            }
            else if (cIndex !== startIndex) {
              edges[edg] = true;
              cycle.push(c);
              _visit(c, edg, startIndex);
              // edges[edg] = false;
            }
            else {
              result.push(cycle);
              //not sure what to do here...
              cycle = [];
            }
          }
          else if(childs.length === 1){
            //! discard the cycle
            cycle = [self.nodes[startIndex]];
          }
        }
      }
    };

    function _tostr(a, b) {
      if (a > b) {
        return b.toString() + a.toString();
      }
      else if(b > a) {
        return a.toString() + b.toString();
      }
      else {
        return a.toString() + b.toString();
      }
    }
  };

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
