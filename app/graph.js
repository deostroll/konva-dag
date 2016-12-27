(function(Konva) {
  Konva.Util.$extend = function(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
    return target;
  };

  Konva.Dag = function(dag, options) {
    Konva.Group.call(this, options);
    this._dag = dag;
    this.$init(options);
  };

  Konva.Dag.prototype = {
    $init: function(config) {
      var self = this;
      var nodes = this._dag.nodes;
      // debugger;
      var circles = nodes.map((n, i) => {

        var opts = Konva.Util.$extend({
          x: i * 35,
          y: 0
        }, config.c);

        console.log(opts);
        var c = new Konva.Circle(opts);
        return c;
      });

      this.add.apply(this, circles);
    }

  };
  Konva.Util.extend(Konva.Dag, Konva.Group);
})(Konva)
