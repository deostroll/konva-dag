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
    var nodes = this.nodes.slice();
    nodes.sort(Dag.DEGREE_SORT);
    var iCache = {};
    console.log('Degree: ', nodes.map(n => n.toString(Node.STRING_DEGREE)).toString());
    var list = nodes.map((n, i) => {
      iCache[n.value] = i;
      return {
        item: n,
        mark: false,
        visited: false
      }
    });
    var result = [],
      cache = [],
      levels = {};
    var visit = function(obj) {
      var level = visit.level++;
      if (!obj.visited) {
        var nodes = obj.item.getAllNodes();
        console.log('Children:', nodes.toString(), 'Level:', level);
        var indexes = nodes.map(n => {
          return iCache[n.value];
        });
        var filtered = indexes.filter(function(idx) {
          return list[idx].mark === false;
        });
        levels[visit.level] = filtered;
        console.log('Filtered:', filtered.map(f => list[f].item).toString(),
          'Level:', level);
        if (filtered.length > 0) {
          filtered.forEach(f => {
            var n = list[f];
            console.log('Caching:', n.item.value, 'Level:', level);
            n.mark = true;
            cache.push(f);
            visit(n);
            n.mark = false;
          });
        } else {
          //! no more nodes to mark...
          if (indexes.length === 1) {
            // !this is a tail node...
            console.log('Exhausted...');
            cache = [current];
          } else if (indexes.length > 0 && indexes.some(i => list[i] ===
              list[current])) {
            // !we have a ring
            cache.forEach(idx => list[idx].visited = true);
            console.log('Push...', 'Level:', level);
            result.push(cache.slice());
            cache = [current];
          } else if (indexes.length > 0) {
            // !we have sub-ring...
            console.warn('Sub-ring');
          }
        }
      }
      visit.level--;
    };
    visit.level = 0;
    var current;
    list.forEach(function(obj, i) {
      cache = [i]
      obj.mark = true;
      current = i;
      console.log('i:', i, 'Mark object:', obj.item.value);
      visit(obj);
      obj.mark = false;
    });
    return result.map(arr => arr.map(i => list[i].item));
  };

  dag.prototype.indexOf = function(value) {
    return this.nodes.map(n => n.value).indexOf(value);
  };

  window.Dag = dag;

})(this);
