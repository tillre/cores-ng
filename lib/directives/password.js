(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon, crConstraints) {
    return {
      scope: {
        model: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr) {
        
        scope.pass1 = '';
        scope.pass2 = '';

        // scope.hasError = false;
        // scope.error = '';

        // var oldPass = null;

        var constraint = crConstraints(scope);

        constraint('match', function() {
          return scope.pass1 === scope.pass2;
        }, true);
        
        // addConstraint('match', function() {
        //   return scope.pass1 === scope.pass2;
        // });
        
        // only set model when passwords are equal and not empty

        // var compareValue = function(v1, v2) {
        //   if (v1 === v2) {
        //     if (v1 !== '') {
        //       // set new password
        //       oldPass = scope.model;
        //       scope.model = v1;
        //     }
        //     else if (oldPass !== null) {
        //       // reset original password
        //       scope.model = oldPass;
        //     }
        //     scope.hasError = false;
        //     scope.$emit('form:error', scope.path + ':password', true)
        //   }
        //   else {
        //     scope.error = 'Passwords do not match';
        //     scope.hasError = true;
        //     scope.$emit('form:error', scope.path + ':password', false)
        //   }
        // };
        
        // scope.$watch('pass1', function(newValue) {
        //   compareValue(newValue, scope.pass2);
        // });
        // scope.$watch('pass2', function(newValue) {
        //   compareValue(newValue, scope.pass1);
        // });
      }
    };
  });
  
})();