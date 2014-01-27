

(function() {

  var module = angular.module('cores.directives');

  module.directive('crControl', function($timeout) {
    return {
      require: ['crControl', 'ngModel'],

      controller: function() {

        var validators = {};

        this.addValidator = function(name, fn) {
          validators[name] = fn;
        };

        this.validate = function(value, modelCtrl) {
          Object.keys(validators).forEach(function(name) {
            modelCtrl.$setValidity(name, validators[name](value));
          });
        };
      },


      link: function(scope, elem, attrs, ctrls) {

        var ctrl = ctrls[0];
        var modelCtrl = ctrls[1];

        scope.modelCtrl = modelCtrl;
        scope.options = angular.extend({
          showLabel: true
        }, scope.options);

        $timeout(function() {

          scope.localModel = modelCtrl.$modelValue;
          scope.$watch('localModel', function(value) {
            if (value !== modelCtrl.$modelValue) {
              modelCtrl.$setViewValue(value);
            }
          });

          modelCtrl.$parsers.push(function(value) {
            if (value) {
              ctrl.validate(value, modelCtrl);
            }
            return value;
          });

          scope.$on('cr:model:error', function(e, path, code, message) {
            if (path === scope.path) {
              e.handled = true;
              modelCtrl.$setValidity(code, false);
            }
          });

          scope.$emit('cr:control:init');
        });
      }
    };
  });

})();