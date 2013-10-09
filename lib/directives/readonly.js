(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function(crOptions) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-readonly.html',

      link: function(scope, elem, attrs) {
        scope.options = crOptions.parse(attrs.options);
      }
    };
  });
})();