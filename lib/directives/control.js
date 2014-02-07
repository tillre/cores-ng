

// TODO

// <div cr-control cr-object schema="schema" ng-model="model" label="{{label}}" path="{{path}}">
//   <div cr-control cr-string schema="schema.properties.string" ng-model="model.string" label="{{label}}" path="{{path}}"></div>
//   <div cr-control cr-array schema="schema.properties.array" ng-model="model.array">
//     <div ng-repeat="item in items">
//        <div cr-control cr-object ng-model="item" schema="schema.items" path="{{path}}/{{$index}}"></div>
//     </div>
//   </div>
// </div>




(function() {

  var module = angular.module('cores.directives');

  module.directive('crControl', function(crBuild) {
    return {
      require: 'crControl',
      scope: {
        model: '=',
        schema: '=',
        path: '@',
        required: '@'
      },
      replace: true,
      templateUrl: 'cr-control.html',

      controller: function($scope) {
        var self = this;
        var validators = {};
        $scope.errors = {};
        $scope.valid = true;
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
          if (newValue !== oldValue) {
            $scope.dirty = true;
          }
          self.validate();
        });
      },


      link: function(scope, elem, attrs, ctrl) {

        var required = scope.required === 'true';

        scope.label = crBuild.getLabel(scope.schema, scope.path);

        scope.options = angular.extend({
          showLabel: true
        }, scope.schema.view);

        scope.$on('cr:model:error', function(e, path, code, message) {
          if (path === scope.path) {
            e.handled = true;
            ctrl.setValidity(code, false);
          }
        });

        elem.html(crBuild.buildType(scope, scope.schema));
      }
    };
  });

})();