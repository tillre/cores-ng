(function() {

  var module = angular.module('cores.directives');


  module.directive('crColumnObject', function(
    crBuild,
    crViews
  ) {
    return {
      replace: true,
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          inline: false
        }, scope.schema.view);

        var props = crBuild.buildProperties(scope, scope.schema, scope.model, scope.path);

        var cols = Math.round(12 / props.length);
        if (cols < 2) cols = 2;
        var colClass = 'col-md-' + cols;

        var columns = [];
        for (var i = 0; i < props.length; ++i) {
          columns.push($('<div class="cr-seperate ' + colClass + '"></div>').html(props[i].elem));
        }
        var row = $('<div class="row"></div>').html(columns);
        elem.find('.properties').append(row);
      }
    };
  });

})();
