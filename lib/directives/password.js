(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon) {
    return {
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        name: '@'
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
          if (v1 === '' && v2 === '') return;
          if (v1 === v2 && v1 !== '') {
            scope.hasError = false;
            scope.model = v1;

            ctrl.$setValidity('me', true);
          }
          else {
            scope.hasError = true;
            scope.error = 'Passwords do not match';

            ctrl.$setValidity('me', false);
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