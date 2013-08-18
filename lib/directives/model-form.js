(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelForm', function($compile, crBuild, crSchema, crCommon) {
    return {
      scope: {
        model: '=',
        schema: '=',
        valid: '=',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      controller: function($scope) {

        $scope.errors = {};

        $scope.$on('set:error', function(e, id) {
          e.stopPropagation();
          $scope.errors[id] = true;
          $scope.valid = false;
        });

        $scope.$on('remove:error', function(e, id) {
          e.stopPropagation();
          delete $scope.errors[id];
          $scope.valid = Object.keys($scope.errors).length === 0;
        });
      },

      link: function(scope, elem) {

        scope.$watch('model', function() {

          if (!scope.schema) return;

          if (!crSchema.isObjectSchema(scope.schema)) {
            throw new Error('Top level schema has to be an object');
          }

          var tmpl = crBuild(scope.schema, scope.model, 'schema', 'model',
                             scope.path || '', { mode: 'minimal'});

          var link = $compile(tmpl);
          var content = link(scope);

          elem.find('form').html(content);
        });
      }
    };
  });
})();