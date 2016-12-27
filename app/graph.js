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
    this._config = options;
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
        var c = new Konva.Circle(opts);
        return c;
      });
      this.add.apply(this, circles);
    },
    getEnvelope: function(stage) {
      var envelope = new Konva.Group();
      var config = this._config;
      var nodes = this._dag.nodes;
      var len = nodes.length;
      var increment = Math.PI * 2 / len;
      var radius = 50;
      var circles = nodes.map((n, i) => {
        var angle = increment * i;
        var cx = radius * Math.cos(angle), cy = radius * Math.sin(angle);
        var opts = Konva.Util.$extend({
          x: cx, y: cy
        }, config.c);
        var circle = new Konva.Circle(opts);
        var topts = Konva.Util.$extend({x: cx, y: cy, text: n.value.toString()}, config.t);
        var txt = new Konva.Text(topts);
        var trect = txt.getClientRect();
        txt.offset({
          x: trect.width/2,
          y: trect.height/2
        });
        envelope.add(circle);
        envelope.add(txt);
        return circle;
      });
      // var rect = envelope.getClientRect();
      return envelope;
    }
  };
  Konva.Util.extend(Konva.Dag, Konva.Group);
})(Konva)
