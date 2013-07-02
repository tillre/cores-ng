(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crValidation) {
    return {
      scope: {
        model: '=',
        schema: '=',
        name: '@',
        path: '@',
        isRequired: '@'
      },
      
      replace: true,
      templateUrl: 'cr-password.html',

      link: function(scope, elem, attr) {

        var validation = crValidation(scope, scope.path, scope.schema);

        validation.addConstraint('maxLength', function(value) {
          return value.length <= scope.schema.maxLength;
        });

        validation.addConstraint('minLength', function(value) {
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
            validation.removeError('match');
          }
          else {
            scope.model = oldPass;
            validation.setError('match');
          }
        };
        
        scope.$watch('pass1', function(newValue) {
          compareValue(newValue, scope.pass2);
        });

        scope.$watch('pass2', function(newValue) {
          compareValue(newValue, scope.pass1);
        });

        scope.$emit('ready');
      }
    };
  });
  
})();