(function() {

  var module = angular.module('cores.services');
  
  module.factory('crConstraints', function() {

    return function(scope, schema) {

      schema = schema || {};
      
      var errors = {};
      var constraints = [];

      
      scope.hasErrors = function() {
        return Object.keys(errors).length > 0;
      };

      
      scope.hasError = function(name) {
        return !!errors[name];
      };

      
      scope.getFirstError = function() {
        for (var x in errors) {
          if (errors[x]) return x;
        }
        return '';
      };

      
      scope.$watch('model', function(newValue, oldValue, scope) {
        constraints.forEach(function(c) {
          c(newValue);
        });
      });

      
      return function constraint(name, condition, isCustomConstraint) {

        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !schema.hasOwnProperty(name)) return;
        
        constraints.push(function(value) {

          if (condition(value)) {
            if (errors.hasOwnProperty(name)) {
              scope.$emit('error:remove', scope.path + ':' + name);
              delete errors[name];
            }
          }
          else {
            scope.$emit('error:set', scope.path + ':' + name);
            errors[name] = true;
          }
        });
      }
    }
  });
})();