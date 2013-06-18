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

        // only set model when passwords are equal and not empty

        var compareValue = function(v1, v2) {
          if (v1 === v2 && v1 !== '') {
            console.log('equal');
            scope.model = v1;
          }
          else {
            console.log('not equal');
          }
        };
        
        scope.$watch('pass1', function(newValue) {
          compareValue(newValue, scope.pass2);
        });
        scope.$watch('pass2', function(newValue) {
          compareValue(newValue, scope.pass1);
        });
      }
    };
  });
  
})();