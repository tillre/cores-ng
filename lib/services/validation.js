(function() {

  var module = angular.module('cores.services');
  
  module.factory('crValidation', function() {

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


      var setError = function(name) {
        errors[name] = true;
        scope.$emit('error:set', scope.path + ':' + name);
      };

      
      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('error:remove', scope.path + ':' + name);
        }
      };

      
      var addConstraint = function(name, condition, isCustomConstraint) {

        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !schema.hasOwnProperty(name)) return;
        
        constraints.push(function(value) {

          condition(value) ? removeError(name) : setError(name);
        });
      }

      
      return {
        addConstraint: addConstraint,
        setError: setError,
        removeError: removeError
      };
    }
  });
})();