(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon) {
    return {
      scope: {
        model: '=',
        name: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr) {
        scope.pass1 = '';
        scope.pass2 = '';

        scope.$watch(function(scope) {
          if (scope.pass1 || scope.pass2) {
            if (scope.pass1 === scope.pass2) {
              scope.model = scope.pass1;
            }
          }
        });
      }
    };
  });
  
})();