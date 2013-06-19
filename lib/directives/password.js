(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr, ctrl) {
        scope.pass1 = '';
        scope.pass2 = '';

        scope.hasError = false;
        scope.error = '';
        
        // only set model when passwords are equal and not empty

        var compareValue = function(v1, v2) {
          if (v1 === v2) {
            if (v1 !== '') {
              scope.model = v1;
            }
            scope.hasError = false;
            ctrl.$setValidity('me', true);
          }
          else {
            scope.error = 'Passwords do not match';
            scope.hasError = true;
            ctrl.$setValidity('me', false);
            console.log('model valid', scope.$valid);
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