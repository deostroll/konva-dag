(function(Konva) {
  Konva.Dag = function(dag, options) {
    Konva.Group.call(this, options);
    this._dag = dag;
    this.$init(options);
  };

  Konva.Dag.prototype = {
    $init: function(config) {
      var nodes = this._dag.nodes;

    }
  }
})(Konva)
