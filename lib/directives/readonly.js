(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },

      replace: true,
      templateUrl: 'cr-readonly.html'
    };
  });
})();