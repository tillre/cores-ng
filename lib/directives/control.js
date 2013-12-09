(function() {

  var module = angular.module('cores.directives');


  module.directive('crControl', function(
    $compile,
    crBuild
  ) {
    return {
      scope: {
        schema: '=',
        model: '=',
        path: '@',
        options: '='
      },

      link: function(scope, elem, attrs) {
        console.log('control link', elem[0]);
        var unwatch = scope.$watch('schema', function(newValue) {
          if (!newValue) return;
          unwatch();

          var build = crBuild.buildTemplate(scope.schema, scope.model,
                                            scope.path, scope.options);
          var link = $compile(build.template);
          var content = link(scope);
          elem.html(build.template);
        });
      }
    };
  });

})();