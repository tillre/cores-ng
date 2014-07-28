(function() {

  var module = angular.module('cores.directives');

  module.directive('crControl', function(crBuild, crViews) {
    return {
      require: 'crControl',
      scope: {
        model: '=',
        schema: '=',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-control.html',

      controller: function($scope) {
        var self = this;
        var validators = {};

        $scope.errors = {};
        $scope.valid = true;
        $scope.childsErrors = {};
        $scope.childsValid = true;
        $scope.dirty = false;

        this.addValidator = function(name, fn) {
          validators[name] = fn;
        };

        this.setValidity = function(code, valid) {
          $scope.errors[code] = valid;
        };

        this.validate = function() {
          $scope.valid = true;
          angular.forEach(validators, function(validator, code) {
            var valid = validator($scope.model);
            if (!valid) {
              $scope.valid = false;
            }
            $scope.errors[code] = !valid;
            $scope.$emit('cr:model:setValidity', $scope.path + ':' + code, valid);
          });
        };

        $scope.$watch('model', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            $scope.dirty = true;
            $scope.$emit('cr:model:change', $scope.path);
          }
          self.validate();
        });
      },


      link: function(scope, elem, attrs, ctrl) {

        scope.required = attrs.hasOwnProperty('required');
        scope.label = crBuild.getLabel(scope.schema, scope.path);

        // set validity on model error
        scope.$on('cr:model:error', function(e, path, code, message) {
          if (path === scope.path) {
            e.handled = true;
            ctrl.setValidity(code, false);
          }
        });

        // set validity based on child validity
        scope.$on('cr:model:setValidity', function(e, code, valid) {
          scope.childsErrors[code] = !valid;
          scope.childsValid = true;
          angular.forEach(scope.childsErrors, function(error, key) {
            if (error) {
              scope.childsValid = false;
            }
          });
        });

        elem.html(crBuild.buildType(scope, scope.schema));
      }
    };
  });

})();