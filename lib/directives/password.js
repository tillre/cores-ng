(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function(crFieldLink, crValidation) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-password.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.pass1 = '';
        scope.pass2 = '';
        var oldPass = scope.model;

        crCtrl.addValidator('match', function() {
          return scope.pass1 === scope.pass2;
        });

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }


        var compareValue = function(v1, v2) {
          // only set model when passwords are equal and not empty
          if (v1 === v2) {
            if (v1 !== '') {
              scope.model = v1;
            }
            else {
              scope.model = oldPass;
            }
          }
          else {
            scope.model = oldPass;
            crCtrl.validate();
          }
        };

        scope.$watch('pass1', function(value) {
          if (value) {
            scope.dirty = true;
          }
          compareValue(value, scope.pass2);
          crCtrl.validate();
        });

        scope.$watch('pass2', function(value) {
          if (value) {
            scope.dirty = true;
          }
          compareValue(value, scope.pass1);
          crCtrl.validate();
        });
      }
    };
  });

})();