(function() {

  var module = angular.module('cores.directives');


  module.directive('crEnum', function(crOptions) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-enum.html',

      link: function(scope, elem, attrs) {
        scope.options = crOptions.parse(attrs.options);
      }
    };
  });

})();