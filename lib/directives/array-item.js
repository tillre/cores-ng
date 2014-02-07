(function() {

  var module = angular.module('cores.directives');


  module.directive('crArrayItem', function($compile, crCommon, crBuild) {
    return {
      scope: {
        model: '=',
        getSchema: '&',
        path: '@'
      },

      link: function(scope, elem, attrs) {

        scope.schema = scope.getSchema();

        var control = crBuild.buildControl(scope, 'schema', 'model', scope.path);
        elem.html(control);
      }
    };
  });

})();