(function() {

  var module = angular.module('cores.directives');


  module.directive('crObject', function(
    crBuild
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
        elem.find('.properties').html(
          props.map(function(p) { return p.elem; })
        );
      }
    };
  });

})();