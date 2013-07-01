(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crCommon, crConstraints) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-password.html',

      controller: crCommon.StandardCtrl,
      
      link: function(scope, elem, attr) {

        var constraints = crConstraints(scope, scope.schema);

        constraints.add('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        constraints.add('minLength', function(value) {
          return value.length >= scope.schema.minLength;
        });
        
        scope.pass1 = '';
        scope.pass2 = '';
        var oldPass = scope.model;
        
        var compareValue = function(v1, v2) {
          // only set model when passwords are equal and not empty
          if (v1 === v2) {
            if (v1 !== '') {
              scope.model = v1;
            }
            else {
              scope.model = oldPass;
            }
            constraints.removeError('match');
          }
          else {
            scope.model = oldPass;
            constraints.setError('match');
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